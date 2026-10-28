import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { DeclaredVariable } from '../../code/getVariablesFromBlock.use.case';
import { DeclaredParameter } from '../../code/getParametersFromBlock.use.case';
import { UnifaceUnusedVariableAnalyzer } from '../unusedVariablesAnalyzer';
import {
    uninitializedVariableDiagnosticCode,
    UnusedVariablesDiagnosticPublisherContract,
    unusedVariableDiagnosticCode,
    VariableDiagnostic,
} from '../unusedVariablesDiagnosticPublisher';

class DiagnosticPublisherStub implements UnusedVariablesDiagnosticPublisherContract {
    public publishedDiagnostics: VariableDiagnostic[] | undefined;
    public clearedDocuments: vscode.TextDocument[] = [];

    public publish(_document: vscode.TextDocument, diagnostics: VariableDiagnostic[]): void {
        this.publishedDiagnostics = diagnostics;
    }

    public clear(document: vscode.TextDocument): void {
        this.clearedDocuments.push(document);
    }

    public dispose(): void {}
}

suite('UnifaceUnusedVariableAnalyzer', () => {
    const block: BlockCode = {
        text: 'entry sampleEntry\nvariables\nstring usedValue, unusedValue\nendvariables\nusedValue = 1\nresult = usedValue\nend',
        startLine: 0,
        lines: [
            'entry sampleEntry',
            'variables',
            'string usedValue, unusedValue',
            'endvariables',
            'usedValue = 1',
            'result = usedValue',
            'end',
        ],
    };
    const variables: DeclaredVariable[] = [
        { name: 'usedValue', dataType: 'string', line: 2 },
        { name: 'unusedValue', dataType: 'string', line: 2 },
    ];

    test('clears diagnostics when the document has no blocks', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '',
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UnifaceUnusedVariableAnalyzer(publisher, undefined, {
            getBlocks: () => [],
            getVariables: () => [],
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.clearedDocuments, [document]);
    });

    test('publishes only variables not used in a block', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: block.text,
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UnifaceUnusedVariableAnalyzer(publisher, undefined, {
            getBlocks: () => [block],
            getVariables: () => variables,
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.publishedDiagnostics, [
            {
                variable: variables[1],
                code: unusedVariableDiagnosticCode,
                message: 'Variable "unusedValue" is declared but is not used.',
            },
        ]);
    });

    test('publishes unused variables from every block in the document', async () => {
        const secondBlock: BlockCode = {
            text: 'operation secondOperation\nvariables\nstring secondUnused\nendvariables\nend',
            startLine: 6,
            lines: ['operation secondOperation', 'variables', 'string secondUnused', 'endvariables', 'end'],
        };
        const secondUnused: DeclaredVariable = {
            name: 'secondUnused',
            dataType: 'string',
            line: 8,
        };
        const document = await vscode.workspace.openTextDocument({
            content: `${block.text}\n${secondBlock.text}`,
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UnifaceUnusedVariableAnalyzer(publisher, undefined, {
            getBlocks: () => [block, secondBlock],
            getVariables: (currentBlock) =>
                currentBlock === block ? variables : [secondUnused],
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.publishedDiagnostics, [
            {
                variable: variables[1],
                code: unusedVariableDiagnosticCode,
                message: 'Variable "unusedValue" is declared but is not used.',
            },
            {
                variable: secondUnused,
                code: unusedVariableDiagnosticCode,
                message: 'Variable "secondUnused" is declared but is not used.',
            },
        ]);
    });

    test('skips analysis when a block END is missing', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry incomplete\nstring unusedValue',
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UnifaceUnusedVariableAnalyzer(publisher, undefined, {
            getBlocks: () => {
                throw new Error('The block analyzer must not run');
            },
            getVariables: () => [],
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.clearedDocuments, [document]);
        assert.strictEqual(publisher.publishedDiagnostics, undefined);
    });

    test('reports an interpolated variable that was never initialized', async () => {
        const interpolationBlock: BlockCode = {
            text: 'entry sampleEntry\nvariables\nstring teste, teste2\nendvariables\nteste2 = "%%teste%%%"\nend',
            startLine: 0,
            lines: [
                'entry sampleEntry',
                'variables',
                'string teste, teste2',
                'endvariables',
                'teste2 = "%%teste%%%"',
                'end',
            ],
        };
        const interpolationVariables: DeclaredVariable[] = [
            { name: 'teste', dataType: 'string', line: 2 },
            { name: 'teste2', dataType: 'string', line: 2 },
        ];
        const document = await vscode.workspace.openTextDocument({
            content: interpolationBlock.text,
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UnifaceUnusedVariableAnalyzer(publisher, undefined, {
            getBlocks: () => [interpolationBlock],
            getVariables: () => interpolationVariables,
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.publishedDiagnostics, [
            {
                variable: interpolationVariables[1],
                code: unusedVariableDiagnosticCode,
                message: 'Variable "teste2" is declared but is not used.',
            },
            {
                variable: interpolationVariables[0],
                code: uninitializedVariableDiagnosticCode,
                message: 'Variable "teste" is used but was never initialized.',
                range: new vscode.Range(4, 12, 4, 17),
            },
        ]);
    });

    test('uses local out parameter directions while analyzing a document', async () => {
        const targetBlock: BlockCode = {
            text: 'entry teste\nparams\nnumeric pNrCalculo : out\nendparams\nend',
            startLine: 0,
            lines: ['entry teste', 'params', 'numeric pNrCalculo : out', 'endparams', 'end'],
        };
        const callerBlock: BlockCode = {
            text: 'entry teste2\nvariables\nnumeric vCalculo\nendvariables\ncall teste(vCalculo)\nmessage/info vCalculo\nend',
            startLine: 5,
            lines: [
                'entry teste2',
                'variables',
                'numeric vCalculo',
                'endvariables',
                'call teste(vCalculo)',
                'message/info vCalculo',
                'end',
            ],
        };
        const callerVariable: DeclaredVariable = { name: 'vCalculo', dataType: 'numeric', line: 7 };
        const targetParameter: DeclaredParameter = {
            name: 'pNrCalculo',
            dataType: 'numeric',
            line: 2,
            direction: 'out',
        };
        const document = await vscode.workspace.openTextDocument({
            content: `${targetBlock.text}\n${callerBlock.text}`,
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UnifaceUnusedVariableAnalyzer(publisher, undefined, {
            getBlocks: () => [targetBlock, callerBlock],
            getVariables: (currentBlock) => (currentBlock === callerBlock ? [callerVariable] : []),
            getParameters: (currentBlock) => (currentBlock === targetBlock ? [targetParameter] : []),
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.publishedDiagnostics, []);
    });
});

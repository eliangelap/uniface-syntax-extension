import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { DeclaredVariable } from '../../code/getVariablesFromBlock.use.case';
import { UnifaceUnusedVariableAnalyzer } from '../unusedVariablesAnalyzer';
import { UnusedVariablesDiagnosticPublisherContract } from '../unusedVariablesDiagnosticPublisher';

class DiagnosticPublisherStub implements UnusedVariablesDiagnosticPublisherContract {
    public publishedVariables: DeclaredVariable[] | undefined;
    public clearedDocuments: vscode.TextDocument[] = [];

    public publish(_document: vscode.TextDocument, unusedVariables: DeclaredVariable[]): void {
        this.publishedVariables = unusedVariables;
    }

    public clear(document: vscode.TextDocument): void {
        this.clearedDocuments.push(document);
    }

    public dispose(): void {}
}

suite('UnifaceUnusedVariableAnalyzer', () => {
    const block: BlockCode = {
        text: 'entry sampleEntry\nvariables\nstring usedValue, unusedValue\nendvariables\nusedValue = 1\nend',
        startLine: 0,
        lines: [
            'entry sampleEntry',
            'variables',
            'string usedValue, unusedValue',
            'endvariables',
            'usedValue = 1',
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

        assert.deepStrictEqual(publisher.publishedVariables, [variables[1]]);
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

        assert.deepStrictEqual(publisher.publishedVariables, [variables[1], secondUnused]);
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
        assert.strictEqual(publisher.publishedVariables, undefined);
    });
});

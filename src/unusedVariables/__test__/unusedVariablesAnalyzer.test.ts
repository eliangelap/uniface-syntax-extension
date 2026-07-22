import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { DeclaredVariable } from '../../code/getVariablesFromBlock.use.case';
import {
    UnifaceUnusedVariableAnalyzer,
} from '../unusedVariablesAnalyzer';
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

    test('clears diagnostics when the document is not active or has no block', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '',
            language: 'uniface',
        });
        const otherDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UnifaceUnusedVariableAnalyzer(
            publisher,
            undefined,
            {
                getActiveTextEditor: () =>
                    ({ document: otherDocument, selection: new vscode.Selection(0, 0, 0, 0) }) as unknown as vscode.TextEditor,
                getBlock: () => null,
                getVariables: () => [],
            }
        );

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.clearedDocuments, [document]);
    });

    test('publishes only variables not used in the active block', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: block.text,
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UnifaceUnusedVariableAnalyzer(
            publisher,
            undefined,
            {
                getActiveTextEditor: () =>
                    ({ document, selection: new vscode.Selection(0, 0, 0, 0) }) as unknown as vscode.TextEditor,
                getBlock: () => block,
                getVariables: () => variables,
            }
        );

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.publishedVariables, [variables[1]]);
    });
});

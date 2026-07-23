import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { DeclaredVariable } from '../../code/getVariablesFromBlock.use.case';
import { UndeclaredVariableAnalyzer } from '../undeclaredVariableAnalyzer';
import { UndeclaredVariablesDiagnosticPublisherContract } from '../undeclaredVariablesDiagnosticPublisher';
import { UndeclaredVariableUsage } from '../undeclaredVariableUsageAnalyzer';

class DiagnosticPublisherStub implements UndeclaredVariablesDiagnosticPublisherContract {
    public usages: UndeclaredVariableUsage[] | undefined;

    public publish(_document: vscode.TextDocument, usages: UndeclaredVariableUsage[]): void {
        this.usages = usages;
    }

    public clear(): void {}

    public dispose(): void {}
}

suite('UndeclaredVariableAnalyzer', () => {
    test('considers parameters declared before publishing diagnostics', async () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'params',
                '    string parameter : in',
                'endparams',
                'result = parameter',
                'end',
            ],
        };
        const document = await vscode.workspace.openTextDocument({
            content: block.lines.join('\n'),
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const parameters: DeclaredVariable[] = [{ name: 'parameter', dataType: 'string', line: 2 }];
        const analyzer = new UndeclaredVariableAnalyzer(publisher, undefined, {
            getBlocks: () => [block],
            getVariables: () => [],
            getParameters: () => parameters,
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.usages?.map((usage) => usage.name), ['result']);
    });

    test('publishes diagnostics from every block in the document', async () => {
        const firstBlock: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry first', 'firstResult = 1', 'end'],
        };
        const secondBlock: BlockCode = {
            text: '',
            startLine: 3,
            lines: ['operation second', 'secondResult = 1', 'end'],
        };
        const document = await vscode.workspace.openTextDocument({
            content: [...firstBlock.lines, ...secondBlock.lines].join('\n'),
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UndeclaredVariableAnalyzer(publisher, undefined, {
            getBlocks: () => [firstBlock, secondBlock],
            getVariables: () => [],
            getParameters: () => [],
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.usages?.map((usage) => usage.name), [
            'firstResult',
            'secondResult',
        ]);
    });

    test('ignores calls to entries that declare a return value', async () => {
        const callerBlock: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry caller',
                'vStcReceituario->urlDownload = PLURLDOWNLOADREC() + noReturnFunction()',
                'end',
            ],
        };
        const returnValueFunctionBlock: BlockCode = {
            text: '',
            startLine: 3,
            lines: ['entry plUrlDownloadRec', 'returns string', 'return ""', 'end'],
        };
        const noReturnFunctionBlock: BlockCode = {
            text: '',
            startLine: 7,
            lines: ['entry noReturnFunction', 'return 0', 'end'],
        };
        const document = await vscode.workspace.openTextDocument({
            content: [
                ...callerBlock.lines,
                ...returnValueFunctionBlock.lines,
                ...noReturnFunctionBlock.lines,
            ].join('\n'),
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UndeclaredVariableAnalyzer(publisher, undefined, {
            getBlocks: () => [callerBlock, returnValueFunctionBlock, noReturnFunctionBlock],
            getVariables: (block) =>
                block === callerBlock
                    ? [{ name: 'vStcReceituario', dataType: 'struct', line: 1 }]
                    : [],
            getParameters: () => [],
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.usages?.map((usage) => usage.name), ['noReturnFunction']);
    });

    test('uses declared data types to validate extraction parameters', async () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', 'result = vDtTransacao[h]', 'end'],
        };
        const document = await vscode.workspace.openTextDocument({
            content: block.lines.join('\n'),
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new UndeclaredVariableAnalyzer(publisher, undefined, {
            getBlocks: () => [block],
            getVariables: () => [
                { name: 'result', dataType: 'numeric', line: 1 },
                { name: 'vDtTransacao', dataType: 'datetime', line: 1 },
            ],
            getParameters: () => [],
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.usages, []);
    });
});

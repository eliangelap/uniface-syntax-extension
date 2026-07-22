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
            getActiveTextEditor: () =>
                ({ document, selection: new vscode.Selection(4, 0, 4, 0) }) as unknown as vscode.TextEditor,
            getBlock: () => block,
            getVariables: () => [],
            getParameters: () => parameters,
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.usages?.map((usage) => usage.name), ['result']);
    });
});

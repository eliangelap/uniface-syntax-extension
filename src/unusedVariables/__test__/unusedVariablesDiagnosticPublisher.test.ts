import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { UnusedVariablesDiagnosticPublisher } from '../unusedVariablesDiagnosticPublisher';

suite('UnusedVariablesDiagnosticPublisher', () => {
    test('publishes warnings for unused variables and clears them', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry sampleEntry\nstring unusedValue\nend',
            language: 'uniface',
        });
        let publishedDiagnostics: readonly vscode.Diagnostic[] | undefined;
        let clearedUri: vscode.Uri | undefined;
        const diagnostics = {
            set: (_uri: vscode.Uri, values: readonly vscode.Diagnostic[]) => {
                publishedDiagnostics = values;
            },
            delete: (uri: vscode.Uri) => {
                clearedUri = uri;
            },
            dispose: () => undefined,
        } as unknown as vscode.DiagnosticCollection;
        const publisher = new UnusedVariablesDiagnosticPublisher(diagnostics);

        publisher.publish(document, [{ name: 'unusedValue', dataType: 'string', line: 1 }]);
        publisher.clear(document);

        assert.strictEqual(publishedDiagnostics?.length, 1);
        assert.strictEqual(
            publishedDiagnostics?.[0].message,
            'Variable "unusedValue" is declared but is not used.'
        );
        assert.deepStrictEqual(publishedDiagnostics?.[0].range, document.lineAt(1).range);
        assert.strictEqual(clearedUri?.toString(), document.uri.toString());
    });
});

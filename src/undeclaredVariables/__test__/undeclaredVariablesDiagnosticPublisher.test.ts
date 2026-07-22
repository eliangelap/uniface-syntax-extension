import * as assert from 'node:assert';
import * as vscode from 'vscode';
import {
    undeclaredVariableDiagnosticCode,
    UndeclaredVariablesDiagnosticPublisher,
} from '../undeclaredVariablesDiagnosticPublisher';

suite('UndeclaredVariablesDiagnosticPublisher', () => {
    test('publishes error diagnostics with the undeclared-variable code', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'result = 1',
            language: 'uniface',
        });
        let diagnostics: readonly vscode.Diagnostic[] | undefined;
        const collection = {
            set: (_uri: vscode.Uri, values: readonly vscode.Diagnostic[]) => {
                diagnostics = values;
            },
            delete: () => undefined,
            dispose: () => undefined,
        } as unknown as vscode.DiagnosticCollection;

        new UndeclaredVariablesDiagnosticPublisher(collection).publish(document, [
            { name: 'result', range: new vscode.Range(0, 0, 0, 6) },
        ]);

        assert.strictEqual(diagnostics?.length, 1);
        assert.strictEqual(diagnostics?.[0].severity, vscode.DiagnosticSeverity.Error);
        assert.strictEqual(diagnostics?.[0].code, undeclaredVariableDiagnosticCode);
        assert.strictEqual(diagnostics?.[0].message, 'Variable "result" is not declared.');
    });
});

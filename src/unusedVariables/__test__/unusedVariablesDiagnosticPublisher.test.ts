import * as assert from 'node:assert';
import * as vscode from 'vscode';
import {
    UnusedVariablesDiagnosticPublisher,
    uninitializedVariableDiagnosticCode,
    unusedVariableDiagnosticCode,
} from '../unusedVariablesDiagnosticPublisher';

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

        publisher.publish(document, [
            {
                variable: { name: 'unusedValue', dataType: 'string', line: 1 },
                message: 'Variable "unusedValue" is declared but is not used.',
                code: unusedVariableDiagnosticCode,
            },
            {
                variable: { name: 'uninitializedValue', dataType: 'string', line: 1 },
                message: 'Variable "uninitializedValue" is used but was never initialized.',
                code: uninitializedVariableDiagnosticCode,
                range: new vscode.Range(0, 0, 0, 20),
            },
        ]);
        publisher.clear(document);

        assert.strictEqual(publishedDiagnostics?.length, 2);
        assert.strictEqual(
            publishedDiagnostics?.[0].message,
            'Variable "unusedValue" is declared but is not used.'
        );
        assert.deepStrictEqual(publishedDiagnostics?.[0].range, document.lineAt(1).range);
        assert.strictEqual(publishedDiagnostics?.[0].code, unusedVariableDiagnosticCode);
        assert.strictEqual(
            publishedDiagnostics?.[1].message,
            'Variable "uninitializedValue" is used but was never initialized.'
        );
        assert.deepStrictEqual(publishedDiagnostics?.[1].range, new vscode.Range(0, 0, 0, 20));
        assert.strictEqual(publishedDiagnostics?.[1].code, uninitializedVariableDiagnosticCode);
        assert.strictEqual(clearedUri?.toString(), document.uri.toString());
    });
});

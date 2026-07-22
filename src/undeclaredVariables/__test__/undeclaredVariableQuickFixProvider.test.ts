import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { undeclaredVariableDiagnosticCode } from '../undeclaredVariablesDiagnosticPublisher';
import {
    declareVariableCommand,
    UndeclaredVariableQuickFixProvider,
} from '../undeclaredVariableQuickFixProvider';

suite('UndeclaredVariableQuickFixProvider', () => {
    test('offers a declaration action for an undeclared variable diagnostic', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'result = 1',
            language: 'uniface',
        });
        const diagnostic = new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 6),
            'Variable "result" is not declared.',
            vscode.DiagnosticSeverity.Error
        );
        diagnostic.code = undeclaredVariableDiagnosticCode;

        const actions = new UndeclaredVariableQuickFixProvider().provideCodeActions(
            document,
            diagnostic.range,
            { diagnostics: [diagnostic], only: undefined, triggerKind: vscode.CodeActionTriggerKind.Invoke }
        );

        assert.strictEqual(actions.length, 1);
        assert.strictEqual(actions[0].title, 'Declare variable "result"');
        assert.strictEqual(actions[0].command?.command, declareVariableCommand);
    });
});

import * as vscode from 'vscode';
import { undeclaredVariableDiagnosticCode } from './undeclaredVariablesDiagnosticPublisher';

export const declareVariableCommand = 'uniface-extension.declareVariable';

export class UndeclaredVariableQuickFixProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

    public provideCodeActions(
        document: vscode.TextDocument,
        _range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext
    ): vscode.CodeAction[] {
        return context.diagnostics
            .filter((diagnostic) => diagnostic.code === undeclaredVariableDiagnosticCode)
            .map((diagnostic) => {
                const variableName = document.getText(diagnostic.range);
                const action = new vscode.CodeAction(
                    `Declare variable "${variableName}"`,
                    vscode.CodeActionKind.QuickFix
                );
                action.diagnostics = [diagnostic];
                action.command = {
                    command: declareVariableCommand,
                    title: `Declare variable "${variableName}"`,
                    arguments: [document.uri, variableName, diagnostic.range.start.line],
                };

                return action;
            });
    }
}

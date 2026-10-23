import * as vscode from 'vscode';
import { undeclaredVariableDiagnosticCode } from './undeclaredVariablesDiagnosticPublisher';

export const declareVariableCommand = 'uniface-extension.declareVariable';
export const declareParameterCommand = 'uniface-extension.declareParameter';

export class UndeclaredVariableQuickFixProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

    public provideCodeActions(
        document: vscode.TextDocument,
        _range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext
    ): vscode.CodeAction[] {
        return context.diagnostics
            .filter((diagnostic) => diagnostic.code === undeclaredVariableDiagnosticCode)
            .flatMap((diagnostic) => {
                const variableName = document.getText(diagnostic.range);
                return [
                    this.createAction(
                        `Declare variable "${variableName}"`,
                        declareVariableCommand,
                        document.uri,
                        variableName,
                        diagnostic
                    ),
                    this.createAction(
                        `Declare parameter "${variableName}"`,
                        declareParameterCommand,
                        document.uri,
                        variableName,
                        diagnostic
                    ),
                ];
            });
    }

    private createAction(
        title: string,
        command: string,
        documentUri: vscode.Uri,
        variableName: string,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction {
        const action = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
        action.diagnostics = [diagnostic];
        action.command = {
            command,
            title,
            arguments: [documentUri, variableName, diagnostic.range.start.line],
        };

        return action;
    }
}

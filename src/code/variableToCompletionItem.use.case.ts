import * as vscode from 'vscode';

export class VariableToCompletionItem {
    public execute(variableName: string, itemKind: vscode.CompletionItemKind) {
        return new vscode.CompletionItem(variableName, itemKind);
    }
}

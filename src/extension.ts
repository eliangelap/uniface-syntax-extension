import * as vscode from 'vscode';
import { createOperationSnippet } from './operation-snippet';
import { createEntrySnippet } from './entry-snippet';

export function activate(context: vscode.ExtensionContext) {
    const operation = vscode.commands.registerCommand(
        'uniface-extension.operation',
        () => {
            createOperationSnippet();
        }
    );

    const entry = vscode.commands.registerCommand(
        'uniface-extension.entry',
        () => {
            createEntrySnippet();
        }
    );

    context.subscriptions.push(operation);
    context.subscriptions.push(entry);
}

// This method is called when your extension is deactivated
export function deactivate() {
    vscode.window.showInformationMessage("I am very sad! :'(");
}

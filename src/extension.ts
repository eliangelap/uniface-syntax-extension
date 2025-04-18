import * as vscode from 'vscode';
import { CompletionItemProvider } from './completionProvider';
import { formatterProvider } from './formatterProvider';
import { registerGoldInterceptor } from './gold/goldHandler';
import { registerGoldDecorationEvents } from './gold/goldDecorator';
import { UnifaceDefinitionProvider } from './definition/entryDefinition';
import { EntryCreator } from './snippets/entryCreator';
import { OperationCreator } from './snippets/operationCreator';
import { registerTreeDataProvider } from './sidebar/functionTreeProvider';

export function activate(context: vscode.ExtensionContext) {
    registerGoldInterceptor(context);
    registerGoldDecorationEvents(context);
    registerTreeDataProvider(context);

    context.subscriptions.push(
        vscode.commands.registerCommand('uniface-extension.entry', () => {
            new EntryCreator().promptAndInsert();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('uniface-extension.operation', () => {
            new OperationCreator().promptAndInsert();
        })
    );

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            'uniface',
            new CompletionItemProvider()
        )
    );

    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
            'uniface',
            formatterProvider()
        )
    );
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            'uniface',
            new UnifaceDefinitionProvider()
        )
    );
}

export function deactivate() {
    vscode.window.showInformationMessage("I am very sad! :'(");
}

import * as vscode from 'vscode';
import { createOperationSnippet } from './snippets/operation-snippet';
import { createEntrySnippet } from './snippets/entry-snippet';
import { CompletionItemProvider } from './provider-lsp';
import { formatterProvider } from './formatter';
import { registerGoldInterceptor } from './gold/goldHandler';
import {
    initGoldDecorator,
    registerGoldDecorationEvents,
    updateGoldDecorations,
} from './gold/goldDecorator';
import { UnifaceDefinitionProvider } from './definition/entryDefinition';
import { FunctionTreeProvider } from './sidebar/FunctionTreeProvider';

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

    const provider = vscode.languages.registerCompletionItemProvider(
        'uniface',
        new CompletionItemProvider()
    );

    const formatter = vscode.languages.registerDocumentFormattingEditProvider(
        'uniface',
        formatterProvider()
    );

    const definitionProvider = vscode.languages.registerDefinitionProvider(
        'uniface',
        new UnifaceDefinitionProvider()
    );

    registerGoldInterceptor(context);
    initGoldDecorator();
    registerGoldDecorationEvents(context);

    if (vscode.window.activeTextEditor) {
        updateGoldDecorations(vscode.window.activeTextEditor);
    }

    registerTreeDataProvider(context);

    context.subscriptions.push(operation);
    context.subscriptions.push(entry);
    context.subscriptions.push(provider);
    context.subscriptions.push(formatter);
    context.subscriptions.push(definitionProvider);
}

export function deactivate() {
    vscode.window.showInformationMessage("I am very sad! :'(");
}

function registerTreeDataProvider(context: vscode.ExtensionContext) {
    const functionTreeProvider = new FunctionTreeProvider();
    const treeView = vscode.window.createTreeView('unifaceFunctions', {
        treeDataProvider: functionTreeProvider,
    });

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'uniface.navigateToFunction',
            (line: number) => {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const position = new vscode.Position(line, 0);
                    editor.selection = new vscode.Selection(position, position);
                    editor.revealRange(new vscode.Range(position, position));
                }
            }
        )
    );

    vscode.workspace.onDidOpenTextDocument((doc) => {
        if (doc.languageId === 'uniface') {
            functionTreeProvider.refresh(doc);
        }
    });

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.languageId === 'uniface') {
            functionTreeProvider.refresh(editor.document);
        }
    });

    vscode.workspace.onDidChangeTextDocument((e) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && e.document === editor.document) {
            functionTreeProvider.refresh(editor.document);
        }
    });

    if (vscode.window.activeTextEditor) {
        functionTreeProvider.refresh(vscode.window.activeTextEditor.document);
    }

    context.subscriptions.push(treeView);
}

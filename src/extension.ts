import * as vscode from 'vscode';
import { CompletionItemProvider } from './completionProvider';
import { UnifaceDefinitionProvider } from './definition/entryDefinition';
import { formatterProvider } from './formatterProvider';
import { registerGoldDecorationEvents } from './gold/goldDecorator';
import { registerGoldInterceptor } from './gold/goldHandler';
import { registerTreeDataProvider } from './sidebar/entryTreeProvider';
import { EntryCreator } from './snippets/entryCreator';
import { OperationCreator } from './snippets/operationCreator';
import { UnifaceUnusedVariableAnalyzer } from './unusedVariables/unusedVariablesAnalyzer';
import { UnifaceSignatureHelpProvider } from './signatureHelpProvider';
import { UndeclaredVariableAnalyzer } from './undeclaredVariables/undeclaredVariableAnalyzer';
import {
    declareVariableCommand,
    UndeclaredVariableQuickFixProvider,
} from './undeclaredVariables/undeclaredVariableQuickFixProvider';
import { DeclareVariableCommand } from './undeclaredVariables/declareVariableCommand';

interface PromptAndInsert {
    promptAndInsert(): Promise<void>;
}

export function runPromptAndInsert(creator: PromptAndInsert): Promise<void> {
    return creator.promptAndInsert();
}

export function shouldAnalyzeDocument(
    editor: vscode.TextEditor | undefined,
    document: vscode.TextDocument
): boolean {
    return document.languageId === 'uniface' && editor?.document === document;
}

export function activate(context: vscode.ExtensionContext) {
    registerGoldInterceptor(context);
    registerGoldDecorationEvents(context);
    registerTreeDataProvider(context);

    const variableAnalyzer = new UnifaceUnusedVariableAnalyzer();
    const undeclaredVariableAnalyzer = new UndeclaredVariableAnalyzer();
    const declarationCommand = new DeclareVariableCommand();

    context.subscriptions.push(
        vscode.commands.registerCommand('uniface-extension.entry', () => {
            return runPromptAndInsert(new EntryCreator());
        }),
        vscode.commands.registerCommand('uniface-extension.operation', () => {
            return runPromptAndInsert(new OperationCreator());
        }),
        vscode.commands.registerCommand(declareVariableCommand, (uri, name, usageLine) => {
            return declarationCommand.execute(uri, name, usageLine);
        }),
        vscode.languages.registerCompletionItemProvider('uniface', new CompletionItemProvider()),
        vscode.languages.registerDocumentFormattingEditProvider('uniface', formatterProvider()),
        vscode.languages.registerDefinitionProvider('uniface', new UnifaceDefinitionProvider()),
        vscode.languages.registerCodeActionsProvider(
            'uniface',
            new UndeclaredVariableQuickFixProvider(),
            { providedCodeActionKinds: UndeclaredVariableQuickFixProvider.providedCodeActionKinds }
        ),
        vscode.languages.registerSignatureHelpProvider(
            { language: 'uniface' },
            new UnifaceSignatureHelpProvider(),
            '(',
            ','
        ),
        vscode.workspace.onDidOpenTextDocument((doc) => {
            if (shouldAnalyzeDocument(vscode.window.activeTextEditor, doc)) {
                variableAnalyzer.analyzeDocument(doc);
                undeclaredVariableAnalyzer.analyzeDocument(doc);
            }
        }),
        vscode.workspace.onDidChangeTextDocument((e) => {
            const editor = vscode.window.activeTextEditor;
            if (shouldAnalyzeDocument(editor, e.document)) {
                variableAnalyzer.analyzeDocument(e.document);
                undeclaredVariableAnalyzer.analyzeDocument(e.document);
            }
        }),
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && shouldAnalyzeDocument(editor, editor.document)) {
                variableAnalyzer.analyzeDocument(editor.document);
                undeclaredVariableAnalyzer.analyzeDocument(editor.document);
            }
        }),
        vscode.workspace.onDidCloseTextDocument((doc) => {
            variableAnalyzer.clearDiagnostics(doc);
            undeclaredVariableAnalyzer.clearDiagnostics(doc);
        }),
        variableAnalyzer,
        undeclaredVariableAnalyzer
    );
}

export function deactivate() {
    return undefined;
}

import * as vscode from "vscode";
import { CompletionItemProvider } from "./completionProvider";
import { UnifaceDefinitionProvider } from "./definition/entryDefinition";
import { formatterProvider } from "./formatterProvider";
import { registerGoldDecorationEvents } from "./gold/goldDecorator";
import { registerGoldInterceptor } from "./gold/goldHandler";
import { registerTreeDataProvider } from "./sidebar/entryTreeProvider";
import { EntryCreator } from "./snippets/entryCreator";
import { OperationCreator } from "./snippets/operationCreator";
import { UnifaceUnusedVariableAnalyzer } from "./unusedVariablesAnalyzer";
import { UnifaceSignatureHelpProvider } from "./signatureHelpProvider";

export function activate(context: vscode.ExtensionContext) {
    const editor = vscode.window.activeTextEditor;

    let document = editor?.document;
    if (document?.languageId !== "uniface") {
        return;
    }

    registerGoldInterceptor(context);
    registerGoldDecorationEvents(context);
    registerTreeDataProvider(context);

    const variableAnalyzer = new UnifaceUnusedVariableAnalyzer();

    context.subscriptions.push(
        vscode.commands.registerCommand("uniface-extension.entry", () => {
            new EntryCreator().promptAndInsert();
        }),
        vscode.commands.registerCommand("uniface-extension.operation", () => {
            new OperationCreator().promptAndInsert();
        }),
        vscode.languages.registerCompletionItemProvider(
            "uniface",
            new CompletionItemProvider()
        ),
        vscode.languages.registerDocumentFormattingEditProvider(
            "uniface",
            formatterProvider()
        ),
        vscode.languages.registerDefinitionProvider(
            "uniface",
            new UnifaceDefinitionProvider()
        ),
        vscode.languages.registerSignatureHelpProvider(
            { language: "uniface" },
            new UnifaceSignatureHelpProvider(document),
            "(",
            ",",
            ", "
        ),
        vscode.workspace.onDidOpenTextDocument((doc) =>
            variableAnalyzer.analyzeDocument(doc)
        ),
        vscode.workspace.onDidChangeTextDocument((e) =>
            variableAnalyzer.analyzeDocument(e.document)
        ),
        vscode.workspace.onDidCloseTextDocument((doc) =>
            variableAnalyzer.clearDiagnostics(doc)
        ),
        variableAnalyzer
    );
}

export function deactivate() {
    vscode.window.showInformationMessage("I am very sad! :'(");
}

import * as vscode from "vscode";
import { createOperationSnippet } from "./snippets/operation-snippet";
import { createEntrySnippet } from "./snippets/entry-snippet";
import { CompletionItemProvider } from "./provider-lsp";
import { formatterProvider } from "./formatter";
import { registerGoldInterceptor } from "./gold/goldHandler";
import {
  initGoldDecorator,
  registerGoldDecorationEvents,
  updateGoldDecorations,
} from "./gold/goldDecorator";
import { UnifaceDefinitionProvider } from "./definition/entryDefinition";

export function activate(context: vscode.ExtensionContext) {
  const operation = vscode.commands.registerCommand(
    "uniface-extension.operation",
    () => {
      createOperationSnippet();
    }
  );

  const entry = vscode.commands.registerCommand(
    "uniface-extension.entry",
    () => {
      createEntrySnippet();
    }
  );

  const provider = vscode.languages.registerCompletionItemProvider(
    "uniface",
    new CompletionItemProvider()
  );

  const formatter = vscode.languages.registerDocumentFormattingEditProvider(
    "uniface",
    formatterProvider()
  );

  const definitionProvider = vscode.languages.registerDefinitionProvider(
    "uniface",
    new UnifaceDefinitionProvider()
  );

  registerGoldInterceptor(context);
  initGoldDecorator();
  registerGoldDecorationEvents(context);

  if (vscode.window.activeTextEditor) {
    updateGoldDecorations(vscode.window.activeTextEditor);
  }

  context.subscriptions.push(operation);
  context.subscriptions.push(entry);
  context.subscriptions.push(provider);
  context.subscriptions.push(formatter);
  context.subscriptions.push(definitionProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showInformationMessage("I am very sad! :'(");
}

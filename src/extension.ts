import * as vscode from "vscode";
import { createOperationSnippet } from "./operation-snippet";
import { createEntrySnippet } from "./entry-snippet";
import { completionItemProvider } from "./provider-lsp";

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
    completionItemProvider()
  );

  context.subscriptions.push(operation);
  context.subscriptions.push(entry);
  context.subscriptions.push(provider);
}

// This method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showInformationMessage("I am very sad! :'(");
}

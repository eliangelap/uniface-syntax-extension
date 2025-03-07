const vscode = require("vscode");

function activate(context) {
  vscode.window.showInformationMessage("Extension loaded!");

  const provider = vscode.languages.registerCompletionItemProvider("uniface", {
    provideCompletionItems(document, position) {
      const text = document.getText();

      const variableRegex = /variables([\s\S]*?)endvariables/gi;
      const matchVariablesBlock = variableRegex.exec(text);

      const completions = [];
      if (matchVariablesBlock) {
        const varLines = matchVariablesBlock[1].split("\n");
        for (const line of varLines) {
          const varMatch = line
            .trim()
            .match(/(STRING|NUMERIC|STRUCT|BOOLEAN)\s+(\w+)/i);
          if (varMatch) {
            const item = new vscode.CompletionItem(
              varMatch[2],
              vscode.CompletionItemKind.Variable
            );
            completions.push(item);
          }
        }
      }

      console.log(completions);

      const paramRegex = /params([\s\S]*?)endparams/gi;
      const matchParamsBlock = paramRegex.exec(text);
      if (matchParamsBlock) {
        const paramLines = matchParamsBlock[1].split("\n");
        for (const line of paramLines) {
          const paramMatch = line
            .trim()
            .match(/(STRING|NUMERIC|STRUCT|BOOLEAN)\s+(\w+)/i);
          if (paramMatch) {
            const item = new vscode.CompletionItem(
              paramMatch[2],
              vscode.CompletionItemKind.Parameter
            );
            completions.push(item);
          }
        }
      }

      return completions;
    },
  });

  context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

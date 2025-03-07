import * as vscode from "vscode";

function getBlockAroundPosition(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  const text = document.getText();
  const cursorOffset = document.offsetAt(position);

  // Localiza o início do bloco (entry|trigger) antes do cursor
  let blockStart = text.lastIndexOf("entry", cursorOffset);
  const triggerStart = text.lastIndexOf("trigger", cursorOffset);
  if (triggerStart > blockStart) {
    blockStart = triggerStart;
  }
  if (blockStart < 0) {
    blockStart = 0;
  }

  // Localiza o fim do bloco (end) depois do cursor
  let blockEnd = text.indexOf("\nend", cursorOffset);
  const endTrigger = text.indexOf("\nend", cursorOffset);
  if (endTrigger >= 0 && (blockEnd < 0 || endTrigger < blockEnd)) {
    blockEnd = endTrigger + "\nend".length;
  }
  if (blockEnd < 0) {
    blockEnd = text.length;
  }

  return text.substring(blockStart, blockEnd);
}

export const completionItemProvider = (): vscode.CompletionItemProvider => {
  return {
    provideCompletionItems(document, position) {
      return provideCompletionItems(document, position);
    },
  };
};

export const provideCompletionItems = (
  document: vscode.TextDocument,
  position: vscode.Position
) => {
  const blockText = getBlockAroundPosition(document, position);

  const variableRegex = /variables([\s\S]*?)endvariables/gi;
  const matchVariablesBlock = variableRegex.exec(blockText);

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

  const paramRegex = /params([\s\S]*?)endparams/gi;
  const matchParamsBlock = paramRegex.exec(blockText);
  if (matchParamsBlock) {
    const paramLines = matchParamsBlock[1].split("\n");
    for (const line of paramLines) {
      const paramMatch = line
        .trim()
        .match(/(STRING|NUMERIC|STRUCT|BOOLEAN)\s+(\w+)/i);
      if (paramMatch) {
        const item = new vscode.CompletionItem(
          paramMatch[2],
          vscode.CompletionItemKind.Variable
        );
        completions.push(item);
      }
    }
  }

  return completions;
};

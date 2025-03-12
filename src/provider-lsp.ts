import * as vscode from "vscode";

function getBlockAroundPosition(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  const text = document.getText();
  const cursorOffset = document.offsetAt(position);

  // Localiza o início do bloco (entry|trigger) antes do cursor
  let blockStart = text.lastIndexOf("entry ", cursorOffset);
  const triggerStart = text.lastIndexOf("trigger ", cursorOffset);
  const operationStart = text.lastIndexOf("operation ", cursorOffset);
  const functionStart = text.lastIndexOf("function ", cursorOffset);

  blockStart = Math.max(
    blockStart,
    triggerStart,
    operationStart,
    functionStart
  );

  if (blockStart < 0) {
    return "";
  }

  // Localiza o fim do bloco (end) depois do cursor
  let blockEnd = text.indexOf("end", cursorOffset);

  if (blockEnd < 0) {
    blockEnd = text.length;
  }

  const subString = text.substring(blockStart, blockEnd);

  if (
    !subString.includes("variables") &&
    !subString.includes("params") &&
    !subString.includes("endvariables") &&
    !subString.includes("endparams")
  ) {
    return "";
  }

  const endRegex = /(^|\s)end(\s|;|$)/;
  if (endRegex.test(subString)) {
    return "";
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
  const completions = [];

  const entries: string[] = document.getText().match(/entry\s+(\w+)/gi) || [];

  const lineText = document.lineAt(position).text;

  if (lineText.includes("call")) {
    const entryItems = entries.map((entry) => {
      const entryName = entry.replace("entry", "").trim();
      return new vscode.CompletionItem(
        entryName,
        vscode.CompletionItemKind.Method
      );
    });
    completions.push(...entryItems);

    return completions;
  }

  const blockText = getBlockAroundPosition(document, position);

  if (!blockText) {
    return [];
  }

  const variableRegex = /variables([\s\S]*?)endvariables/gi;
  const matchVariablesBlock = variableRegex.exec(blockText);

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
      const paramMatch = line.trim().match(/(\$?\w+\$?)\s*:\s*(in|out|inout)/i);

      if (paramMatch) {
        const item = new vscode.CompletionItem(
          paramMatch[1],
          vscode.CompletionItemKind.Variable
        );
        completions.push(item);
      }
    }
  }

  return completions;
};

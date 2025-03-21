import * as vscode from "vscode";

export const formatterProvider = (): vscode.DocumentFormattingEditProvider => {
  return {
    provideDocumentFormattingEdits(document, options, token) {
      return provideFormatter(document, options, token);
    },
  };
};

const provideFormatter = (
  document: vscode.TextDocument,
  options: vscode.FormattingOptions,
  token: vscode.CancellationToken
) => {
  const text = document.getText();

  const lines = text.split("\n");

  const formattedLines = formatTab(lines, options);

  const formattedText = formattedLines.join("\n");

  const firstLine = document.lineAt(0);

  const lastLine = document.lineAt(document.lineCount - 1);

  const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

  return [new vscode.TextEdit(range, formattedText)];
};

const formatTab = (lines: string[], options: vscode.FormattingOptions) => {
  let deepLevel = 0;

  const formattedLines = lines.map((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("#define")) {
      return trimmedLine;
    }

    if (
      trimmedLine.match(
        /^(end|endif|endfor|endwhile|endvariables|endparams)(\s+\S+)?$/i
      ) ||
      trimmedLine.match(/^end\s*;/i)
    ) {
      if (deepLevel > 0) {
        deepLevel--;
      }
    }

    const tabWidth = options.tabSize || 5;
    const formattedLine = " ".repeat(deepLevel * tabWidth) + trimmedLine;

    if (
      trimmedLine.match(
        /^(entry|trigger|if|operation|for|while|forentity|variables|params|forlist|forlist\/id)(\s+\S+)?$/i
      ) ||
      trimmedLine.match(
        /^(entry|trigger|if|operation|for|while|variables|params|forlist|forlist\/id)\s*\(/g
      )
    ) {
      deepLevel++;
    }

    return formattedLine;
  });

  return formattedLines;
};

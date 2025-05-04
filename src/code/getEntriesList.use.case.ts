import * as vscode from "vscode";

export class GetEntriesList {
    public execute(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completions = [];
        const entries: string[] =
            document.getText().match(/entry\s+(\w+)/gi) || [];

        const lineText = document.lineAt(position).text.trim();

        if (lineText.startsWith("call")) {
            const entryItems = entries.map((entry) => {
                const entryName = entry
                    .trim()
                    .split(" ")[1]
                    .trim()
                    .split(";")[0];
                return new vscode.CompletionItem(
                    entryName,
                    vscode.CompletionItemKind.Method
                );
            });
            completions.push(...entryItems);
        }

        return completions;
    }
}

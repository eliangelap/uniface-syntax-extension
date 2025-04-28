import * as vscode from 'vscode';

export class GetEntriesList {
    public execute(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completions = [];
        const entries: string[] =
            document.getText().match(/entry\s+(\w+)/gi) || [];

        const lineText = document.lineAt(position).text;

        if (lineText.includes('call')) {
            const entryItems = entries.map((entry) => {
                const entryName = entry.replace('entry', '').trim();
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

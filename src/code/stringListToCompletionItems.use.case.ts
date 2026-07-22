import * as vscode from 'vscode';

export class StringListToCompletionItems {
    public execute(
        strings: string[],
        itemKind: vscode.CompletionItemKind
    ): vscode.CompletionItem[] {
        const completionItems: vscode.CompletionItem[] = [];
        const uniqueStrings = new Set<string>();

        for (const stringItem of strings) {
            const normalizedItem = stringItem.toLowerCase();
            if (uniqueStrings.has(normalizedItem)) {
                continue;
            }

            uniqueStrings.add(normalizedItem);
            const completionItem = new vscode.CompletionItem(stringItem, itemKind);
            completionItem.insertText = stringItem;

            completionItems.push(completionItem);
        }

        return completionItems;
    }
}

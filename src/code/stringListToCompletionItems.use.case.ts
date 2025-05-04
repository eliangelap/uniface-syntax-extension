import * as vscode from "vscode";

export class StringListToCompletionItems {
    public execute(strings: string[], itemKind: vscode.CompletionItemKind) {
        const completionItems = [];
        for (let stringItem of strings) {
            const completionItem = new vscode.CompletionItem(
                stringItem,
                itemKind
            );

            completionItem.insertText = stringItem.startsWith("$")
                ? stringItem.substring(1)
                : stringItem;

            completionItems.push(completionItem);
        }

        return completionItems;
    }
}

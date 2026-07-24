import * as vscode from 'vscode';
import { GetEntriesList } from './getEntriesList.use.case';
import { DeclaredModule } from './types/declaredModule';

export class GetEntriesCompletionList {
    public execute(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const declaredModules: DeclaredModule[] = new GetEntriesList().execute(document);

        const textBeforeCursor = document.lineAt(position).text.slice(0, position.character);

        if (/\bcall\s+(?:[A-Za-z_]\w*)?$/i.test(textBeforeCursor)) {
            const entryItems = declaredModules.map((entry) => {
                const entryName = entry.name.trim();
                return new vscode.CompletionItem(entryName, vscode.CompletionItemKind.Method);
            });
            completions.push(...entryItems);
        }

        return completions;
    }
}

import * as vscode from "vscode";
import { GetEntriesList } from "./getEntriesList.use.case";
import { DeclaredModule } from './getVariablesFromBlock.use.case';

export class GetEntriesCompletionList {
    public execute(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completions = [];
        const declaredModules: DeclaredModule[] = new GetEntriesList().execute(document);

        const lineText = document.lineAt(position).text.trim();

        if (lineText.startsWith("call")) {
            const entryItems = declaredModules.map((entry) => {
                const entryName = entry.name
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

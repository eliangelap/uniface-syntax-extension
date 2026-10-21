import * as vscode from 'vscode';
import { GetEntriesList } from './getEntriesList.use.case';
import { DeclaredModule } from './types/declaredModule';
import { getCodeOutsideStringsAndComments, isBlockdataLine } from '../util/procCodeScanner';

export class GetEntriesCompletionList {
    public execute(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const declaredModules: DeclaredModule[] = new GetEntriesList().execute(document);
        const lines = document.getText().split('\n');

        if (isBlockdataLine(lines, position.line)) {
            return completions;
        }

        const textBeforeCursor = getCodeOutsideStringsAndComments(
            document.lineAt(position).text.slice(0, position.character)
        ).code;

        const callMatch = /\bcall\s+([A-Za-z_]\w*)?$/i.exec(textBeforeCursor);

        if (callMatch) {
            const typedEntryName = callMatch[1] ?? '';
            const entryNameRange = new vscode.Range(
                position.line,
                position.character - typedEntryName.length,
                position.line,
                position.character
            );
            const entryItems = declaredModules.map((entry) => {
                const entryName = entry.name.trim();
                const completion = new vscode.CompletionItem(
                    entryName,
                    vscode.CompletionItemKind.Method
                );

                completion.insertText = entryName;
                completion.filterText = entryName.toLowerCase();
                completion.range = entryNameRange;

                return completion;
            });
            completions.push(...entryItems);
        }

        return completions;
    }
}

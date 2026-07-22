import * as vscode from 'vscode';
import { GetEntriesList } from '../code/getEntriesList.use.case';

export class UnifaceDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition> {
        if (token.isCancellationRequested) {
            return null;
        }

        const lineText = document.lineAt(position.line).text;
        const codeLine = lineText.split(';', 1)[0];
        const callRegex = /\bcall\s+(\w+)\b/gi;
        let callMatch: RegExpExecArray | null;

        while ((callMatch = callRegex.exec(codeLine)) !== null) {
            const entryName = callMatch[1];
            const entryNameStart = callMatch.index + callMatch[0].lastIndexOf(entryName);
            const entryNameEnd = entryNameStart + entryName.length;

            if (position.character < entryNameStart || position.character > entryNameEnd) {
                continue;
            }

            const entry = new GetEntriesList()
                .execute(document)
                .find(
                    (declaredEntry) => declaredEntry.name.toLowerCase() === entryName.toLowerCase()
                );

            if (!entry) {
                return null;
            }

            const entryLine = document.lineAt(entry.line);
            return new vscode.Location(
                document.uri,
                new vscode.Position(entry.line, entryLine.firstNonWhitespaceCharacterIndex)
            );
        }

        return null;
    }
}

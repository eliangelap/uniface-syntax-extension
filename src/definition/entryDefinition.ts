import * as vscode from 'vscode';

export class UnifaceDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition> {
        const line = document.lineAt(position.line);
        const lineText = line.text;

        if (!lineText.toLowerCase().includes('call ')) {
            return null;
        }

        const callMatch = /call\s+(\w+)/i.exec(lineText);
        if (!callMatch) {
            return null;
        }

        const functionName = callMatch[1];

        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }
        const word = document.getText(wordRange);

        if (word !== functionName) {
            return null;
        }

        const fullText = document.getText();
        const entryRegex = new RegExp(`entry\\s+${functionName}\\b`, 'i');
        const entryMatch = entryRegex.exec(fullText);

        if (entryMatch) {
            const entryPos = document.positionAt(entryMatch.index);
            return new vscode.Location(document.uri, entryPos);
        }

        return null;
    }
}

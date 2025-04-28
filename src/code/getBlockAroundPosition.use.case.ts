import * as vscode from 'vscode';

export interface BlockCode {
    text: string;
    startLine: number;
}

export class GetBlockAroundPostion {
    private blockEndRegex =
        /^\s*end\b(?!if|for|while|variables|params|selectcase|try)/i;
    private blockStartRegex = /^\s*(entry|operation|trigger|function)\b/i;

    public execute(
        document: vscode.TextDocument,
        position: vscode.Position
    ): BlockCode | null {
        const blockStart = this.findStartLineOfBlock(document, position);
        if (blockStart === null) {
            return null;
        }

        const blockEnd = this.findEndLineOfBlock(document, position);
        if (blockEnd === null) {
            return null;
        }

        const textLines = document.getText().split('\n');
        const blockText = textLines.slice(blockStart, blockEnd + 1).join('\n');

        return {
            text: blockText,
            startLine: blockStart,
        };
    }

    private findEndLineOfBlock(
        document: vscode.TextDocument,
        position: vscode.Position
    ): number | null {
        const lines = document.getText().split('\n');

        if (position.line >= lines.length) {
            return null;
        }

        for (let i = position.line; i < lines.length; i++) {
            const line = lines[i].trim().toLowerCase();
            if (line.startsWith(';')) {
                continue;
            }

            if (this.blockEndRegex.test(line)) {
                return i;
            }
        }

        return null;
    }

    private findStartLineOfBlock(
        document: vscode.TextDocument,
        position: vscode.Position
    ): number | null {
        const lines = document.getText().split('\n');

        if (position.line >= lines.length) {
            return null;
        }

        for (let i = position.line; i >= 0; i--) {
            const line = lines[i].toLowerCase().trim();

            if (line.startsWith(';') || line.startsWith('#') || line === '') {
                continue;
            }

            if (this.blockEndRegex.test(line)) {
                return null;
            }

            if (this.blockStartRegex.test(line)) {
                return i;
            }
        }

        return null;
    }
}

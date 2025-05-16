import * as vscode from 'vscode';
import { blockEndRegex, blockStartRegex } from '../regExpConstants';

export interface BlockCode {
    text: string;
    startLine: number;
    lines: string[];
}

export class GetBlockAroundPostion {
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
            lines: blockText.split('\n'),
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

            if (blockEndRegex.test(line)) {
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

            if (blockEndRegex.test(line)) {
                return null;
            }

            if (blockStartRegex.test(line)) {
                return i;
            }
        }

        return null;
    }
}

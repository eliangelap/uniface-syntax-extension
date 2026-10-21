import * as vscode from 'vscode';
import { blockEndRegex, blockStartRegex } from '../regExpConstants';
import { CodeAnalyzer } from '../util/codeAnalyzer.use.case';
import { getCodeOutsideStringsAndCommentsLines } from '../util/procCodeScanner';

export interface BlockCode {
    text: string;
    startLine: number;
    lines: string[];
}

export class GetBlockAroundPosition {
    public execute(document: vscode.TextDocument, position: vscode.Position): BlockCode | null {
        const textLines = document.getText().split('\n');
        const codeLines = getCodeOutsideStringsAndCommentsLines(textLines);
        const blockStart = this.findStartLineOfBlock(codeLines, position);
        if (blockStart === null) {
            return null;
        }

        const blockEnd = this.findEndLineOfBlock(codeLines, position, blockStart);

        const blockText = textLines.slice(blockStart, blockEnd + 1).join('\n');

        return {
            text: blockText,
            startLine: blockStart,
            lines: blockText.split('\n'),
        };
    }

    private findEndLineOfBlock(
        lines: readonly string[],
        position: vscode.Position,
        blockStart: number
    ): number {
        if (position.line >= lines.length) {
            return lines.length - 1;
        }

        for (let i = position.line; i < lines.length; i++) {
            const line = lines[i].trim().toLowerCase();
            if (CodeAnalyzer.isLineCommented(line)) {
                continue;
            }

            if (blockEndRegex.test(line)) {
                return i;
            }

            if (i > blockStart && blockStartRegex.test(line)) {
                return i - 1;
            }
        }

        return lines.length - 1;
    }

    private findStartLineOfBlock(
        lines: readonly string[],
        position: vscode.Position
    ): number | null {
        if (position.line >= lines.length) {
            return null;
        }

        for (let i = position.line; i >= 0; i--) {
            const line = lines[i].toLowerCase().trim();

            if (CodeAnalyzer.isLineCommented(line) || line.startsWith('#') || line === '') {
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

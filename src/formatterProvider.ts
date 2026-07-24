import * as vscode from 'vscode';
import { endKeywordsRegex, startKeywordsRegex } from './regExpConstants';
import { findMissingBlockEnds } from './blockStructure/blockStructureAnalyzer';

export const formatterProvider = (): vscode.DocumentFormattingEditProvider => {
    return {
        provideDocumentFormattingEdits(document, options, token) {
            return new UnifaceFormatterProvider().provideDocumentFormattingEdits(
                document,
                options,
                token
            );
        },
    };
};

class UnifaceFormatterProvider implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        if (findMissingBlockEnds(document.getText().split(/\r?\n/)).length > 0) {
            return [];
        }

        const formatter = new UnifaceFormatter(document.getText(), options);
        const formattedText = formatter.format();

        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

        return [new vscode.TextEdit(range, formattedText)];
    }
}

class UnifaceFormatter {
    private lines: string[];
    private formattedLines: string[] = [];
    private deepLevel = 0;
    private previousLineWasBlank = false;
    private isInContinuation = false;
    private continuationIndent = 0;
    private selectCaseBranchDepths: number[] = [];

    constructor(
        text: string,
        private options: vscode.FormattingOptions
    ) {
        this.lines = text.split('\n');
    }

    public format(): string {
        for (const line of this.lines) {
            const trimmed = line.trim();

            const isBlank = trimmed === '';

            if (this.handleBlankLine(isBlank)) {
                continue;
            }
            if (this.handleDefineDirective(trimmed)) {
                continue;
            }

            const isContinuation = trimmed.endsWith('%\\');
            const isSingleLineIf = this.isSingleLineIf(trimmed);

            this.adjustDepthForEnd(trimmed);
            this.adjustDepthForSelectCaseBranch(trimmed);
            this.addFormattedLine(trimmed);
            this.updateContinuationState(isContinuation);
            if (!isSingleLineIf) {
                this.adjustDepthForStart(trimmed);
            }
        }

        return this.formattedLines.join('\n');
    }

    private isSingleLineIf(trimmed: string): boolean {
        if (trimmed.endsWith('%\\')) {
            return false;
        }

        const ifStart = /^if\s*\(/i.exec(trimmed);
        if (!ifStart) {
            return false;
        }

        let parenthesisDepth = 0;
        let stringDelimiter: '"' | "'" | null = null;
        let isEscaped = false;

        for (let index = ifStart[0].length - 1; index < trimmed.length; index++) {
            const char = trimmed[index];

            if (isEscaped) {
                isEscaped = false;
                continue;
            }

            if (stringDelimiter) {
                if (char === '\\') {
                    isEscaped = true;
                } else if (char === stringDelimiter) {
                    stringDelimiter = null;
                }
                continue;
            }

            if (char === '"' || char === "'") {
                stringDelimiter = char;
            } else if (char === '(') {
                parenthesisDepth++;
            } else if (char === ')') {
                parenthesisDepth--;
                if (parenthesisDepth === 0) {
                    const statement = trimmed.slice(index + 1).trim();
                    return statement !== '' && !statement.startsWith(';');
                }
            } else if (char === ';') {
                return false;
            }
        }

        return false;
    }

    private handleBlankLine(isBlank: boolean): boolean {
        if (!isBlank) {
            return false;
        }

        if (this.previousLineWasBlank) {
            return true;
        }

        this.formattedLines.push('');
        this.previousLineWasBlank = true;
        return true;
    }

    private handleDefineDirective(trimmed: string): boolean {
        if (!trimmed.startsWith('#define')) {
            return false;
        }

        this.formattedLines.push(trimmed);
        this.previousLineWasBlank = false;
        return true;
    }

    private adjustDepthForEnd(trimmed: string): void {
        if (/^endselectcase\b/i.test(trimmed)) {
            const branchDepth = this.selectCaseBranchDepths.pop();
            if (branchDepth !== undefined) {
                this.deepLevel = Math.max(branchDepth - 1, 0);
                return;
            }
        }

        if (RegExp(endKeywordsRegex, 'gi').test(trimmed)) {
            this.deepLevel = Math.max(this.deepLevel - 1, 0);
        }
    }

    private adjustDepthForSelectCaseBranch(trimmed: string): void {
        if (!this.isSelectCaseBranch(trimmed)) {
            return;
        }

        const branchDepth = this.selectCaseBranchDepths.at(-1);
        if (branchDepth !== undefined) {
            this.deepLevel = branchDepth;
        }
    }

    private adjustDepthForStart(trimmed: string): void {
        if (this.isSelectCaseBranch(trimmed) && this.selectCaseBranchDepths.length > 0) {
            this.deepLevel++;
            return;
        }

        if (RegExp(startKeywordsRegex, 'gi').test(trimmed)) {
            this.deepLevel++;

            if (/^selectcase\b/i.test(trimmed)) {
                this.selectCaseBranchDepths.push(this.deepLevel);
            }
        }
    }

    private isSelectCaseBranch(trimmed: string): boolean {
        return /^(?:case|elsecase)\b/i.test(trimmed);
    }

    private addFormattedLine(trimmed: string): void {
        const decreaseKeywords = [/^else\b/i, /^elseif\b/i, /^catch\b/i];

        const inDecreaseKeyword = decreaseKeywords.some((keyword) => keyword.test(trimmed));
        const tabCount = Math.max(inDecreaseKeyword ? this.deepLevel - 1 : this.deepLevel, 0);

        const indent = this.isInContinuation
            ? '\t'.repeat(this.continuationIndent) + '\t'
            : '\t'.repeat(tabCount);

        this.formattedLines.push(indent + trimmed);
        this.previousLineWasBlank = false;
    }

    private updateContinuationState(isContinuation: boolean): void {
        if (isContinuation && !this.isInContinuation) {
            this.isInContinuation = true;
            this.continuationIndent = this.deepLevel;
        } else if (!isContinuation && this.isInContinuation) {
            this.isInContinuation = false;
            this.continuationIndent = 0;
        }
    }
}

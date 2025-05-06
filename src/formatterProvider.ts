import * as vscode from 'vscode';

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

class UnifaceFormatterProvider
    implements vscode.DocumentFormattingEditProvider
{
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        const formatter = new UnifaceFormatter(document.getText(), options);
        const formattedText = formatter.format();

        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const range = new vscode.Range(
            firstLine.range.start,
            lastLine.range.end
        );

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

    constructor(text: string, private options: vscode.FormattingOptions) {
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

            this.adjustDepthForEnd(trimmed);
            this.addFormattedLine(trimmed);
            this.updateContinuationState(isContinuation);
            this.adjustDepthForStart(trimmed);
        }

        return this.formattedLines.join('\n');
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
        const endKeywords = [
            'end',
            'endif',
            'endfor',
            'endwhile',
            'endvariables',
            'endparams',
            'until',
            'endselectcase',
            'endtry',
        ];

        const pattern = `^(${endKeywords.join('|')})(\\s+.*)?\\s*(;.*)?$`;
        if (new RegExp(pattern, 'i').test(trimmed)) {
            this.deepLevel = Math.max(this.deepLevel - 1, 0);
        }
    }

    private adjustDepthForStart(trimmed: string): void {
        const startKeywords = [
            'entry',
            'trigger',
            'if',
            'operation',
            'for',
            'repeat',
            'while',
            'forentity',
            'variables',
            'params',
            'forlist',
            'forlist/id',
            'selectcase',
            'try',
        ];

        const pattern = `^(${startKeywords.join('|')})(\\s+\\S+)?`;
        const parenPattern = `^(${startKeywords.join('|')})\\s*\\(?`;

        if (
            new RegExp(pattern, 'i').test(trimmed) ||
            new RegExp(parenPattern, 'g').test(trimmed)
        ) {
            this.deepLevel++;
        }
    }

    private addFormattedLine(trimmed: string): void {
        const decreaseKeywords = [
            'else',
            'elseif',
            'case ',
            'catch',
            'elsecase',
        ];

        const inDecreaseKeyword = decreaseKeywords.some((k) =>
            trimmed.startsWith(k)
        );
        const tabCount = inDecreaseKeyword
            ? this.deepLevel - 1
            : this.deepLevel;

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

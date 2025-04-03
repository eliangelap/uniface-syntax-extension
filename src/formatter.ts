import * as vscode from 'vscode';

export const formatterProvider = (): vscode.DocumentFormattingEditProvider => {
    return {
        provideDocumentFormattingEdits(document, options, token) {
            return provideFormatter(document, options, token);
        },
    };
};

const provideFormatter = (
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
) => {
    const text = document.getText();

    const lines = text.split('\n');

    const formattedLines = formatTab(lines, options);

    const formattedText = formattedLines.join('\n');

    const firstLine = document.lineAt(0);

    const lastLine = document.lineAt(document.lineCount - 1);

    const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

    return [new vscode.TextEdit(range, formattedText)];
};
const formatTab = (lines: string[], options: vscode.FormattingOptions) => {
    let deepLevel = 0;
    const formattedLines: string[] = [];
    let previousLineWasBlank = false;
    let isInContinuation = false;
    let continuationIndent = 0;

    for (const element of lines) {
        const line = element;
        const trimmedLine = line.trim();
        const isBlankLine = trimmedLine === '';

        if (
            processBlankLine(isBlankLine, previousLineWasBlank, formattedLines)
        ) {
            previousLineWasBlank = isBlankLine;
            continue;
        }

        previousLineWasBlank = isBlankLine;

        if (processDefineDirective(trimmedLine, formattedLines)) {
            continue;
        }

        const isContinuationLine = trimmedLine.endsWith('%\\');

        deepLevel = adjustDepthForEndStatements(trimmedLine, deepLevel);

        addFormattedLine(
            formattedLines,
            trimmedLine,
            deepLevel,
            isInContinuation,
            continuationIndent
        );

        const continuationState = updateContinuationState(
            isContinuationLine,
            isInContinuation,
            deepLevel
        );
        isInContinuation = continuationState.isInContinuation;
        continuationIndent = continuationState.continuationIndent;

        deepLevel = adjustDepthForStartStatements(trimmedLine, deepLevel);
    }

    return formattedLines;
};

const processBlankLine = (
    isBlankLine: boolean,
    previousLineWasBlank: boolean,
    formattedLines: string[]
): boolean => {
    if (!isBlankLine) {
        return false;
    }

    if (previousLineWasBlank) {
        return true;
    }

    formattedLines.push('');
    return true;
};

const processDefineDirective = (
    trimmedLine: string,
    formattedLines: string[]
): boolean => {
    if (!trimmedLine.startsWith('#define')) {
        return false;
    }

    formattedLines.push(trimmedLine);
    return true;
};

const adjustDepthForEndStatements = (
    trimmedLine: string,
    deepLevel: number
): number => {
    const blockEndKeywords = [
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

    const blockEndRegex = new RegExp(
        `^(${blockEndKeywords.join('|')})(\\s+\\S+)?$`,
        'i'
    );

    const blockEndCommentRegex = new RegExp(
        `^(${blockEndKeywords.join('|')})\\s*;`,
        'i'
    );

    if (
        blockEndRegex.exec(trimmedLine) ||
        blockEndCommentRegex.exec(trimmedLine)
    ) {
        if (deepLevel > 0) {
            return deepLevel - 1;
        }
    }
    return deepLevel;
};

const addFormattedLine = (
    formattedLines: string[],
    trimmedLine: string,
    deepLevel: number,
    isInContinuation: boolean,
    continuationIndent: number
): void => {
    let formattedLine;

    if (isInContinuation) {
        formattedLine = '\t'.repeat(continuationIndent) + '\t' + trimmedLine;
    } else {
        formattedLine = '\t'.repeat(deepLevel) + trimmedLine;
    }

    formattedLines.push(formattedLine);
};

const updateContinuationState = (
    isContinuationLine: boolean,
    isInContinuation: boolean,
    deepLevel: number
): { isInContinuation: boolean; continuationIndent: number } => {
    // Track start of continuation
    if (isContinuationLine && !isInContinuation) {
        return { isInContinuation: true, continuationIndent: deepLevel };
    }

    // Track end of continuation
    if (!isContinuationLine && isInContinuation) {
        return { isInContinuation: false, continuationIndent: 0 };
    }

    return {
        isInContinuation,
        continuationIndent: isInContinuation ? deepLevel : 0,
    };
};

const adjustDepthForStartStatements = (
    trimmedLine: string,
    deepLevel: number
): number => {
    const blockStartKeywords = [
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

    const blockStartRegex = new RegExp(
        `^(${blockStartKeywords.join('|')})(\\s+\\S+)?$`,
        'i'
    );

    const blockStartWithParenRegex = new RegExp(
        `^(${blockStartKeywords.join('|')})\\s*\\(?`,
        'g'
    );

    if (
        blockStartRegex.exec(trimmedLine) ||
        blockStartWithParenRegex.exec(trimmedLine)
    ) {
        return deepLevel + 1;
    }
    return deepLevel;
};

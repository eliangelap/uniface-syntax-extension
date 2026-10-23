export type StringDelimiter = '"' | "'" | null;

export interface CodeScannerState {
    stringDelimiter: StringDelimiter;
    isInsideInterpolation: boolean;
    interpolationStringDelimiter: StringDelimiter;
    blockdataDelimiter: string | null;
}

export interface CodeScanResult {
    code: string;
    state: CodeScannerState;
    isBlockdata: boolean;
}

export function createCodeScannerState(): CodeScannerState {
    return {
        stringDelimiter: null,
        isInsideInterpolation: false,
        interpolationStringDelimiter: null,
        blockdataDelimiter: null,
    };
}

export function getNextCodeScannerState(line: string, state: CodeScannerState): CodeScannerState {
    return state.blockdataDelimiter || line.trimEnd().endsWith('%\\')
        ? state
        : createCodeScannerState();
}

export function getCodeOutsideStringsAndCommentsLines(lines: readonly string[]): string[] {
    let state = createCodeScannerState();

    return lines.map((line) => {
        const result = getCodeOutsideStringsAndComments(line, state);
        state = getNextCodeScannerState(line, result.state);
        return result.code;
    });
}

export function isBlockdataLine(lines: readonly string[], lineNumber: number): boolean {
    let state = createCodeScannerState();

    for (let index = 0; index <= lineNumber && index < lines.length; index++) {
        const result = getCodeOutsideStringsAndComments(lines[index], state);
        if (index === lineNumber) {
            return result.isBlockdata;
        }
        state = getNextCodeScannerState(lines[index], result.state);
    }

    return false;
}

export function getUnifaceStringEscapeLength(
    line: string,
    index: number,
    delimiter: Exclude<StringDelimiter, null>
): number {
    if (line[index] !== '%' || line[index + 1] !== '%') {
        return 0;
    }

    return line[index + 2] === '%' || line[index + 2] === delimiter ? 3 : 0;
}

export function getCodeOutsideStringsAndComments(
    line: string,
    initialState: CodeScannerState = {
        stringDelimiter: null,
        isInsideInterpolation: false,
        interpolationStringDelimiter: null,
        blockdataDelimiter: null,
    }
): CodeScanResult {
    let stringDelimiter = initialState.stringDelimiter;
    let isInsideInterpolation = initialState.isInsideInterpolation;
    let interpolationStringDelimiter = initialState.interpolationStringDelimiter;
    let blockdataDelimiter = initialState.blockdataDelimiter;
    let isBackslashEscaped = false;
    let code = '';
    let isBlockdata = blockdataDelimiter !== null;

    if (blockdataDelimiter) {
        const isClosingLine = line.trim() === blockdataDelimiter;

        return {
            code: ' '.repeat(line.length),
            isBlockdata: true,
            state: {
                stringDelimiter: null,
                isInsideInterpolation: false,
                interpolationStringDelimiter: null,
                blockdataDelimiter: isClosingLine ? null : blockdataDelimiter,
            },
        };
    }

    for (let index = 0; index < line.length; index++) {
        const character = line[index];

        if (isBackslashEscaped) {
            isBackslashEscaped = false;
            code += ' ';
            continue;
        }

        if (isInsideInterpolation) {
            if (interpolationStringDelimiter) {
                const escapeLength = getUnifaceStringEscapeLength(
                    line,
                    index,
                    interpolationStringDelimiter
                );

                if (character === '\\') {
                    isBackslashEscaped = true;
                    code += ' ';
                } else if (escapeLength) {
                    code += ' '.repeat(escapeLength);
                    index += escapeLength - 1;
                } else {
                    if (character === interpolationStringDelimiter) {
                        interpolationStringDelimiter = null;
                    }
                    code += ' ';
                }
            } else if (
                character === '%' &&
                line[index + 1] === '%' &&
                line[index + 2] === '%'
            ) {
                code += '   ';
                index += 2;
                isInsideInterpolation = false;
            } else if (character === '"' || character === "'") {
                interpolationStringDelimiter = character;
                code += ' ';
            } else if (character === ';') {
                code += ' '.repeat(line.length - code.length);
                break;
            } else {
                code += character;
            }
            continue;
        }

        if (stringDelimiter) {
            const escapeLength = getUnifaceStringEscapeLength(line, index, stringDelimiter);

            if (character === '\\') {
                isBackslashEscaped = true;
                code += ' ';
            } else if (escapeLength) {
                code += ' '.repeat(escapeLength);
                index += escapeLength - 1;
            } else if (
                character === '%' &&
                line[index + 1] === '%' &&
                line[index + 2] === '$'
            ) {
                code += '  ';
                index += 1;
                isInsideInterpolation = true;
            } else {
                if (character === stringDelimiter) {
                    stringDelimiter = null;
                }
                code += ' ';
            }
            continue;
        }

        if (character === '"' || character === "'") {
            stringDelimiter = character;
            code += ' ';
        } else if (character === ';') {
            code += ' '.repeat(line.length - code.length);
            break;
        } else {
            const blockdata = /^blockdata\s+([^\s])/i.exec(line.slice(index));
            const isWordStart = index === 0 || !/[A-Za-z0-9_]/.test(line[index - 1]);

            if (blockdata && isWordStart) {
                blockdataDelimiter = blockdata[1];
                isBlockdata = true;
                code += ' '.repeat(line.length - index);
                break;
            }

            code += character;
        }
    }

    return {
        code,
        state: {
            stringDelimiter,
            isInsideInterpolation,
            interpolationStringDelimiter,
            blockdataDelimiter,
        },
        isBlockdata,
    };
}

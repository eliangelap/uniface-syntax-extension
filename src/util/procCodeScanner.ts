export type StringDelimiter = '"' | "'" | null;

export interface CodeScanResult {
    code: string;
    delimiter: StringDelimiter;
}

export function getCodeOutsideStringsAndComments(
    line: string,
    initialDelimiter: StringDelimiter = null
): CodeScanResult {
    let delimiter = initialDelimiter;
    let isBackslashEscaped = false;
    let code = '';

    for (let index = 0; index < line.length; index++) {
        const character = line[index];

        if (isBackslashEscaped) {
            isBackslashEscaped = false;
            code += ' ';
            continue;
        }

        if (delimiter) {
            if (character === '\\') {
                isBackslashEscaped = true;
                code += ' ';
            } else if (
                character === '%' &&
                line[index + 1] === '%' &&
                line[index + 2] === delimiter
            ) {
                code += '   ';
                index += 2;
            } else {
                if (character === delimiter) {
                    delimiter = null;
                }
                code += ' ';
            }
            continue;
        }

        if (character === '"' || character === "'") {
            delimiter = character;
            code += ' ';
        } else if (character === ';') {
            code += ' '.repeat(line.length - code.length);
            break;
        } else {
            code += character;
        }
    }

    return { code, delimiter };
}

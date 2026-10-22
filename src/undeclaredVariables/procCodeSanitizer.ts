import {
    CodeScannerState,
    createCodeScannerState,
    getCodeOutsideStringsAndComments,
    getNextCodeScannerState,
} from '../util/procCodeScanner';

export interface InterpolatedVariableReference {
    name: string;
    start: number;
}

export class ProcCodeSanitizer {
    public sanitize(line: string): string {
        return this.sanitizeLine(line, createCodeScannerState()).code;
    }

    public sanitizeLines(lines: readonly string[]): string[] {
        let state = createCodeScannerState();

        return lines.map((line) => {
            const result = this.sanitizeLine(line, state);
            state = getNextCodeScannerState(line, result.state);

            return result.code;
        });
    }

    public getInterpolatedVariables(lines: readonly string[]): InterpolatedVariableReference[][] {
        let delimiter: StringDelimiter = null;
        let isInsideInterpolation = false;

        return lines.map((line) => {
            const references = this.getInterpolatedVariablesFromLine(
                line,
                delimiter,
                isInsideInterpolation
            );
            const isContinuation = line.trimEnd().endsWith('%\\');
            delimiter = isContinuation ? references.delimiter : null;
            isInsideInterpolation = isContinuation ? references.isInsideInterpolation : false;

            return references.variables;
        });
    }

    private sanitizeLine(
        line: string,
        initialState: CodeScannerState
    ): { code: string; state: CodeScannerState } {
        const codeOutsideStringsAndComments = getCodeOutsideStringsAndComments(
            line,
            initialState
        );

        return {
            state: codeOutsideStringsAndComments.state,
            code: codeOutsideStringsAndComments.code
            .replace(/<[A-Za-z_]\w*>/g, (constant) => ' '.repeat(constant.length))
            .replace(/\b[A-Za-z_]\w*\.[A-Za-z_]\w*(?:\/init\b)?\b(?!\s*\[)/gi, (entityField) =>
                ' '.repeat(entityField.length)
            )
            .replace(/(->\s*)([A-Za-z_]\w*)/g, (_access, operator, field) =>
                `${operator}${' '.repeat(field.length)}`
            ),
        };
    }

    private getInterpolatedVariablesFromLine(
        line: string,
        initialDelimiter: StringDelimiter,
        initialIsInsideInterpolation: boolean
    ): {
        delimiter: StringDelimiter;
        isInsideInterpolation: boolean;
        variables: InterpolatedVariableReference[];
    } {
        let delimiter = initialDelimiter;
        let isInsideInterpolation = initialIsInsideInterpolation;
        let isBackslashEscaped = false;
        const variables: InterpolatedVariableReference[] = [];

        for (let index = 0; index < line.length; index++) {
            const character = line[index];

            if (isBackslashEscaped) {
                isBackslashEscaped = false;
                continue;
            }

            if (!delimiter) {
                if (character === '"' || character === "'") {
                    delimiter = character;
                } else if (character === ';') {
                    break;
                }
                continue;
            }

            if (character === '\\') {
                isBackslashEscaped = true;
                continue;
            }

            if (isInsideInterpolation) {
                if (
                    character === '%' &&
                    line[index + 1] === '%' &&
                    line[index + 2] === '%'
                ) {
                    isInsideInterpolation = false;
                    index += 2;
                }
                continue;
            }

            if (character === '%' && line[index + 1] === '%') {
                const interpolationEnd = line.indexOf('%%%', index + 2);
                if (interpolationEnd !== -1) {
                    const reference = this.getInterpolatedVariableReference(
                        line.slice(index + 2, interpolationEnd),
                        index + 2
                    );
                    if (reference) {
                        variables.push(reference);
                    }
                    index = interpolationEnd + 2;
                    continue;
                }

                isInsideInterpolation = true;
                index++;
                continue;
            }

            if (character === delimiter) {
                delimiter = null;
            }
        }

        return { delimiter, isInsideInterpolation, variables };
    }

    private getInterpolatedVariableReference(
        expression: string,
        expressionStart: number
    ): InterpolatedVariableReference | undefined {
        const reference = /^\s*([A-Za-z_]\w*)\s*(?:->.+)?\s*$/.exec(expression);
        if (!reference) {
            return undefined;
        }

        return {
            name: reference[1],
            start: expressionStart + reference.index + reference[0].indexOf(reference[1]),
        };
    }

}

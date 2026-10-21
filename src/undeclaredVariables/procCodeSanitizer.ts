import {
    CodeScannerState,
    createCodeScannerState,
    getCodeOutsideStringsAndComments,
    getNextCodeScannerState,
} from '../util/procCodeScanner';

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

}

import { getCodeOutsideStringsAndComments, StringDelimiter } from '../util/procCodeScanner';

export class ProcCodeSanitizer {
    public sanitize(line: string): string {
        return this.sanitizeLine(line, null).code;
    }

    public sanitizeLines(lines: readonly string[]): string[] {
        let delimiter: StringDelimiter = null;

        return lines.map((line) => {
            const result = this.sanitizeLine(line, delimiter);
            delimiter = line.trimEnd().endsWith('%\\') ? result.delimiter : null;

            return result.code;
        });
    }

    private sanitizeLine(
        line: string,
        initialDelimiter: StringDelimiter
    ): { code: string; delimiter: StringDelimiter } {
        const codeOutsideStringsAndComments = getCodeOutsideStringsAndComments(
            line,
            initialDelimiter
        );

        return {
            delimiter: codeOutsideStringsAndComments.delimiter,
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

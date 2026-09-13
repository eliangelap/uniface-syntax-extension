export class ProcCodeSanitizer {
    public sanitize(line: string): string {
        return this.sanitizeLine(line, null).code;
    }

    public sanitizeLines(lines: readonly string[]): string[] {
        let delimiter: '"' | "'" | null = null;

        return lines.map((line) => {
            const result = this.sanitizeLine(line, delimiter);
            delimiter = line.trimEnd().endsWith('%\\') ? result.delimiter : null;

            return result.code;
        });
    }

    private sanitizeLine(
        line: string,
        initialDelimiter: '"' | "'" | null
    ): { code: string; delimiter: '"' | "'" | null } {
        const codeOutsideStringsAndComments = this.getCodeOutsideStringsAndComments(
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

    private getCodeOutsideStringsAndComments(
        line: string,
        initialDelimiter: '"' | "'" | null
    ): { code: string; delimiter: '"' | "'" | null } {
        let delimiter = initialDelimiter;
        let isEscaped = false;
        let code = '';

        for (const character of line) {
            if (isEscaped) {
                isEscaped = false;
                code += ' ';
                continue;
            }

            if (character === '\\') {
                isEscaped = delimiter !== null;
                code += delimiter ? ' ' : character;
                continue;
            }

            if (delimiter) {
                if (character === delimiter) {
                    delimiter = null;
                }
                code += ' ';
                continue;
            }

            if (character === '"' || character === "'") {
                delimiter = character;
                code += ' ';
                continue;
            }

            if (character === ';') {
                code += ' '.repeat(line.length - code.length);
                break;
            }

            code += character;
        }

        return { code, delimiter };
    }
}

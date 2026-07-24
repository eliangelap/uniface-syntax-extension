export class ProcCodeSanitizer {
    public sanitize(line: string): string {
        return this.getCodeOutsideStringsAndComments(line)
            .replace(/<[A-Za-z_]\w*>/g, (constant) => ' '.repeat(constant.length))
            .replace(/\b[A-Za-z_]\w*\.[A-Za-z_]\w*(?:\/init\b)?\b(?!\s*\[)/gi, (entityField) =>
                ' '.repeat(entityField.length)
            )
            .replace(/(->\s*)([A-Za-z_]\w*)/g, (_access, operator, field) =>
                `${operator}${' '.repeat(field.length)}`
            );
    }

    private getCodeOutsideStringsAndComments(line: string): string {
        let delimiter: '"' | "'" | null = null;
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

        return code;
    }
}

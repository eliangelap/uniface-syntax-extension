import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';

interface VariablePattern {
    name: string;
    pattern: RegExp;
}

export class VariableUsageAnalyzer {
    public getUsedVariables(
        blockLines: string[],
        declaredVariables: DeclaredVariable[]
    ): Set<string> {
        const usedVariables = new Set<string>();
        const variablePatterns = this.createVariablePatterns(declaredVariables);
        let isAfterVariablesBlock = false;

        for (const line of blockLines) {
            const trimmedLine = line.trim();

            if (!isAfterVariablesBlock) {
                if (/^endvariables\b(?:\s*;.*)?$/i.test(trimmedLine)) {
                    isAfterVariablesBlock = true;
                }
                continue;
            }

            const code = this.getCodeOutsideStringsAndComments(line);
            for (const variable of variablePatterns) {
                if (variable.pattern.test(code)) {
                    usedVariables.add(variable.name);
                }
            }
        }

        return usedVariables;
    }

    private createVariablePatterns(declaredVariables: DeclaredVariable[]): VariablePattern[] {
        return declaredVariables.map((variable) => ({
            name: variable.name,
            pattern: new RegExp(String.raw`\b${this.escapeRegExp(variable.name)}\b`, 'i'),
        }));
    }

    private getCodeOutsideStringsAndComments(line: string): string {
        let stringDelimiter: '"' | "'" | null = null;
        let isEscaped = false;
        let code = '';

        for (const character of line) {
            if (isEscaped) {
                isEscaped = false;
                code += ' ';
                continue;
            }

            if (character === '\\') {
                isEscaped = stringDelimiter !== null;
                code += stringDelimiter ? ' ' : character;
                continue;
            }

            if (stringDelimiter) {
                if (character === stringDelimiter) {
                    stringDelimiter = null;
                }
                code += ' ';
                continue;
            }

            if (character === '"' || character === "'") {
                stringDelimiter = character;
                code += ' ';
                continue;
            }

            if (character === ';') {
                break;
            }

            code += character;
        }

        return code;
    }

    private escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
    }
}

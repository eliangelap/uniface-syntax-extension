import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';
import { getCodeOutsideStringsAndComments, StringDelimiter } from '../util/procCodeScanner';

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
        let delimiter: StringDelimiter = null;

        for (const line of blockLines) {
            const trimmedLine = line.trim();

            if (!isAfterVariablesBlock) {
                if (/^endvariables\b(?:\s*;.*)?$/i.test(trimmedLine)) {
                    isAfterVariablesBlock = true;
                }
                continue;
            }

            const scanResult = getCodeOutsideStringsAndComments(line, delimiter);
            delimiter = line.trimEnd().endsWith('%\\') ? scanResult.delimiter : null;
            const code = scanResult.code;
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

    private escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
    }
}

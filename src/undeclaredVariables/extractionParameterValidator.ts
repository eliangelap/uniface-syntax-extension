import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';
const extractionSourceTypes = new Set(['date', 'time', 'datetime', 'numeric', 'string']);

export interface ExtractionParameterValidationResult {
    code: string;
}

export class ExtractionParameterValidator {
    public validate(
        code: string,
        declaredVariables: Iterable<DeclaredVariable>
    ): ExtractionParameterValidationResult {
        const declared = [...declaredVariables];
        const sourceTypes = this.getSourceTypes(declared);
        const numericSources = this.getNumericSources(declared);
        const extractionRegex =
            /(\$?[A-Za-z_]\w*(?:\s*\.\s*[A-Za-z_]\w*)?)\s*\[\s*([^\]\s](?:[^\]]*?[^\]\s])?)\s*\]/g;
        let maskedCode = code;
        let extraction: RegExpExecArray | null;

        while ((extraction = extractionRegex.exec(code)) !== null) {
            const source = extraction[1];
            const parameter = extraction[2];
            const isEntityField = source.includes('.');

            if (isEntityField) {
                maskedCode =
                    maskedCode.slice(0, extraction.index) +
                    ' '.repeat(extraction[0].length) +
                    maskedCode.slice(extraction.index + extraction[0].length);
                continue;
            }

            if (!sourceTypes.has(source.toLowerCase())) {
                continue;
            }

            const parameterStart = extraction.index + extraction[0].lastIndexOf(parameter);
            maskedCode =
                maskedCode.slice(0, parameterStart) +
                ' '.repeat(parameter.length) +
                maskedCode.slice(parameterStart + parameter.length);
        }

        for (const extraction of code.matchAll(/\[\s*([^\]\s](?:[^\]]*?[^\]\s])?)\s*\]/g)) {
            const parameter = extraction[1];
            const parameterStart = extraction.index! + extraction[0].indexOf(parameter);
            let expressionEnd = extraction.index! - 1;
            while (/\s/.test(code[expressionEnd] ?? '')) {
                expressionEnd--;
            }
            const expressionStart = this.getParenthesizedExpressionStart(code, expressionEnd);

            if (
                expressionStart === undefined ||
                !this.isNumericExpression(code.slice(expressionStart + 1, expressionEnd), numericSources)
            ) {
                continue;
            }

            maskedCode =
                maskedCode.slice(0, parameterStart) +
                ' '.repeat(parameter.length) +
                maskedCode.slice(parameterStart + parameter.length);
        }

        return { code: maskedCode };
    }

    private getSourceTypes(declaredVariables: Iterable<DeclaredVariable>): Set<string> {
        const sourceTypes = new Set(['$date', '$clock', '$datim']);

        for (const variable of declaredVariables) {
            const dataType = variable.dataType.toLowerCase();
            if (extractionSourceTypes.has(dataType)) {
                sourceTypes.add(variable.name.toLowerCase());
            }
        }

        return sourceTypes;
    }

    private getNumericSources(declaredVariables: Iterable<DeclaredVariable>): Set<string> {
        const numericSources = new Set<string>();

        for (const variable of declaredVariables) {
            if (variable.dataType.toLowerCase() === 'numeric') {
                numericSources.add(variable.name.toLowerCase());
            }
        }

        return numericSources;
    }

    private getParenthesizedExpressionStart(code: string, expressionEnd: number): number | undefined {
        let nesting = 0;

        for (let index = expressionEnd; index >= 0; index--) {
            if (code[index] === ')') {
                nesting++;
            } else if (code[index] === '(' && --nesting === 0) {
                return index;
            }
        }

        return undefined;
    }

    private isNumericExpression(expression: string, numericSources: ReadonlySet<string>): boolean {
        if (!/^[\s\w.+\-*/%()]+$/.test(expression)) {
            return false;
        }

        const identifiers = expression.match(/[A-Za-z_]\w*/g) ?? [];
        return identifiers.length > 0 && identifiers.every((name) => numericSources.has(name.toLowerCase()));
    }
}

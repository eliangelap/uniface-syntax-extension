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
        const sourceTypes = this.getSourceTypes(declaredVariables);
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
}

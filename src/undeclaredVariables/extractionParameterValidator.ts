import * as vscode from 'vscode';
import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';
import { UndeclaredVariableUsage } from './undeclaredVariableUsage';

type ExtractionSourceType = 'date' | 'time' | 'datetime' | 'numeric';

const extractionParameters: Record<Exclude<ExtractionSourceType, 'numeric'>, Set<string>> = {
    date: new Set(['d', 'm', 'y', 'x', 'w', 'mmm', 'mmm*', 'a', 'aa', 'aa*', 'aaa', 'aaa*']),
    time: new Set(['h', 'n', 's', 't']),
    datetime: new Set([
        'd',
        'm',
        'y',
        'x',
        'w',
        'mmm',
        'mmm*',
        'a',
        'aa',
        'aa*',
        'aaa',
        'aaa*',
        'h',
        'n',
        's',
        't',
        'date',
        'clock',
    ]),
};

export interface ExtractionParameterValidationResult {
    code: string;
    invalidUsages: UndeclaredVariableUsage[];
}

export class ExtractionParameterValidator {
    public validate(
        code: string,
        declaredVariables: Iterable<DeclaredVariable>,
        line: number
    ): ExtractionParameterValidationResult {
        const sourceTypes = this.getSourceTypes(declaredVariables);
        const extractionRegex = /(\$?[A-Za-z_]\w*)\s*\[\s*([^\]\s](?:[^\]]*?[^\]\s])?)\s*\]/g;
        const invalidUsages: UndeclaredVariableUsage[] = [];
        let maskedCode = code;
        let extraction: RegExpExecArray | null;

        while ((extraction = extractionRegex.exec(code)) !== null) {
            const source = extraction[1];
            const parameter = extraction[2];
            const sourceType = sourceTypes.get(source.toLowerCase());
            if (!sourceType) {
                continue;
            }

            const parameterStart = extraction.index + extraction[0].lastIndexOf(parameter);
            if (!this.isValid(sourceType, parameter)) {
                invalidUsages.push({
                    name: parameter,
                    range: new vscode.Range(line, parameterStart, line, parameterStart + parameter.length),
                    message: `Invalid extraction parameter "${parameter}" for ${sourceType} value "${source}".`,
                    diagnosticCode: 'uniface.invalidExtractionParameter',
                });
            }

            maskedCode =
                maskedCode.slice(0, parameterStart) +
                ' '.repeat(parameter.length) +
                maskedCode.slice(parameterStart + parameter.length);
        }

        return { code: maskedCode, invalidUsages };
    }

    private getSourceTypes(declaredVariables: Iterable<DeclaredVariable>): Map<string, ExtractionSourceType> {
        const sourceTypes = new Map<string, ExtractionSourceType>([
            ['$date', 'date'],
            ['$clock', 'time'],
            ['$datim', 'datetime'],
        ]);

        for (const variable of declaredVariables) {
            const dataType = variable.dataType.toLowerCase();
            if (dataType === 'date' || dataType === 'time' || dataType === 'datetime' || dataType === 'numeric') {
                sourceTypes.set(variable.name.toLowerCase(), dataType);
            }
        }

        return sourceTypes;
    }

    private isValid(sourceType: ExtractionSourceType, parameter: string): boolean {
        if (sourceType === 'numeric') {
            return /^(?:trunc|i|fraction|f|r|round(?:\s*,\s*\d+)?)$/i.test(parameter);
        }

        return extractionParameters[sourceType].has(parameter.toLowerCase());
    }
}

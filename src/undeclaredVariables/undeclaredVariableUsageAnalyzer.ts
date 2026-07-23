import * as vscode from 'vscode';
import { variableTypes } from '../regExpConstants';
import { GetStatementList } from '../code/getStatementList.use.case';
import { BlockCode } from '../code/getBlockAroundPosition.use.case';
import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';

export interface UndeclaredVariableUsage {
    name: string;
    range: vscode.Range;
    message?: string;
    diagnosticCode?: string;
}

type ExtractionSourceType = 'date' | 'time' | 'datetime';

const extractionParameters: Record<ExtractionSourceType, Set<string>> = {
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

export class UndeclaredVariableUsageAnalyzer {
    private readonly statements = new Set(
        new GetStatementList().execute().map((statement) => statement.toLowerCase())
    );

    private readonly ignoredWords = new Set(
        [
            ...this.statements,
            ...variableTypes,
            'in',
            'inout',
            'out',
            'true',
            'false',
            'null',
        ].map((word) => word.toLowerCase())
    );

    public getUndeclaredUsages(
        block: BlockCode,
        declaredNames: Iterable<string>,
        returnValueFunctionNames: Iterable<string> = [],
        declaredVariables: Iterable<DeclaredVariable> = []
    ): UndeclaredVariableUsage[] {
        const declared = new Set([...declaredNames].map((name) => name.toLowerCase()));
        const extractionSourceTypes = this.getExtractionSourceTypes(declaredVariables);
        const returnValueFunctions = new Set(
            [...returnValueFunctionNames].map((name) => name.toLowerCase())
        );
        this.addDefinedConstants(block.lines, declared);
        const usages: UndeclaredVariableUsage[] = [];
        let isInsideDeclaration = false;
        let isInsideSelectdbProjection = false;

        for (let lineIndex = 0; lineIndex < block.lines.length; lineIndex++) {
            const line = block.lines[lineIndex];
            const trimmedLine = line.trim();

            if (/^(params|variables)\b(?:\s*;.*)?$/i.test(trimmedLine)) {
                isInsideDeclaration = true;
                continue;
            }

            if (/^(endparams|endvariables)\b(?:\s*;.*)?$/i.test(trimmedLine)) {
                isInsideDeclaration = false;
                continue;
            }

            if (isInsideDeclaration || /^(entry|operation|trigger|function)\b/i.test(trimmedLine)) {
                continue;
            }

            if (/^#(?:include|define)\b/i.test(trimmedLine)) {
                continue;
            }

            const codeOutsideStringsAndComments = this.getCodeOutsideStringsAndComments(line)
                .replace(/<[A-Za-z_]\w*>/g, (constant) => ' '.repeat(constant.length))
                .replace(/\b[A-Za-z_]\w*\.[A-Za-z_]\w*(?:\/init\b)?/gi, (entityField) =>
                    ' '.repeat(entityField.length)
                )
                .replace(/(->\s*)([A-Za-z_]\w*)/g, (_access, operator, field) =>
                    `${operator}${' '.repeat(field.length)}`
                );
            const selectdbProjection = this.maskSelectdbProjection(
                codeOutsideStringsAndComments,
                isInsideSelectdbProjection
            );
            const code = selectdbProjection.code;
            const extractionParametersResult = this.maskExtractionParameters(
                code,
                extractionSourceTypes,
                block.startLine + lineIndex
            );
            const codeWithMaskedExtractionParameters = extractionParametersResult.code;
            usages.push(...extractionParametersResult.invalidUsages);
            isInsideSelectdbProjection = selectdbProjection.isInsideProjection;
            const callFunctionNameStart = this.getCallFunctionNameStart(codeWithMaskedExtractionParameters);
            const activateOperationNameStart = this.getActivateOperationNameStart(
                codeWithMaskedExtractionParameters
            );
            const statementModifierStart = this.getStatementModifierStart(
                codeWithMaskedExtractionParameters
            );
            const tokenRegex = /\b[A-Za-z_]\w*\b/g;
            let match: RegExpExecArray | null;

            while ((match = tokenRegex.exec(codeWithMaskedExtractionParameters)) !== null) {
                const name = match[0];
                const previousCharacter = codeWithMaskedExtractionParameters[match.index - 1];
                const isStructField =
                    codeWithMaskedExtractionParameters.slice(match.index - 2, match.index) === '->';

                if (
                    previousCharacter === '$' ||
                    isStructField ||
                    match.index === callFunctionNameStart ||
                    match.index === activateOperationNameStart ||
                    match.index === statementModifierStart ||
                    declared.has(name.toLowerCase()) ||
                    (returnValueFunctions.has(name.toLowerCase()) &&
                        this.isFunctionCall(codeWithMaskedExtractionParameters, match.index + name.length)) ||
                    this.ignoredWords.has(name.toLowerCase())
                ) {
                    continue;
                }

                usages.push({
                    name,
                    range: new vscode.Range(
                        block.startLine + lineIndex,
                        match.index,
                        block.startLine + lineIndex,
                        match.index + name.length
                    ),
                });
            }
        }

        return usages;
    }

    private isFunctionCall(code: string, nameEnd: number): boolean {
        return /^\s*\(/.test(code.slice(nameEnd));
    }

    private getExtractionSourceTypes(
        declaredVariables: Iterable<DeclaredVariable>
    ): Map<string, ExtractionSourceType> {
        const sourceTypes = new Map<string, ExtractionSourceType>([
            ['$date', 'date'],
            ['$clock', 'time'],
            ['$datim', 'datetime'],
        ]);

        for (const variable of declaredVariables) {
            const dataType = variable.dataType.toLowerCase();
            if (dataType === 'date' || dataType === 'time' || dataType === 'datetime') {
                sourceTypes.set(variable.name.toLowerCase(), dataType);
            }
        }

        return sourceTypes;
    }

    private maskExtractionParameters(
        code: string,
        sourceTypes: Map<string, ExtractionSourceType>,
        line: number
    ): { code: string; invalidUsages: UndeclaredVariableUsage[] } {
        const extractionRegex = /(\$?[A-Za-z_]\w*)\s*\[\s*([A-Za-z_]\w*\*?)\s*\]/g;
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
            if (!extractionParameters[sourceType].has(parameter.toLowerCase())) {
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

    private maskSelectdbProjection(
        code: string,
        wasInsideProjection: boolean
    ): { code: string; isInsideProjection: boolean } {
        const selectdb = /^\s*selectdb\b/i.exec(code);
        const projectionStart = selectdb
            ? selectdb[0].length
            : wasInsideProjection
              ? 0
              : undefined;

        if (projectionStart === undefined) {
            return { code, isInsideProjection: false };
        }

        const fromMatch = /\bfrom\b/i.exec(code.slice(projectionStart));
        const projectionEnd = fromMatch ? projectionStart + fromMatch.index : code.length;
        const maskedCode =
            code.slice(0, projectionStart) +
            ' '.repeat(projectionEnd - projectionStart) +
            code.slice(projectionEnd);

        return {
            code: maskedCode,
            isInsideProjection: !fromMatch && /%\\\s*$/.test(code),
        };
    }

    private addDefinedConstants(lines: string[], declared: Set<string>): void {
        for (const line of lines) {
            const definition = /^\s*#define\s+([A-Za-z_]\w*)\b/i.exec(line);
            if (definition) {
                declared.add(definition[1].toLowerCase());
            }
        }
    }

    private getCallFunctionNameStart(code: string): number | undefined {
        const call = /^\s*call\s+([A-Za-z_]\w*)\b/i.exec(code);
        if (!call) {
            return undefined;
        }

        return call.index + call[0].length - call[1].length;
    }

    private getActivateOperationNameStart(code: string): number | undefined {
        const activateOperation =
            /^\s*activate(?:\s*\/[A-Za-z_]\w*)*\s+.*?\.\s*([A-Za-z_]\w*)\s*\(/i.exec(code);
        if (!activateOperation) {
            return undefined;
        }

        return activateOperation.index + activateOperation[0].lastIndexOf(activateOperation[1]);
    }

    private getStatementModifierStart(code: string): number | undefined {
        const statementModifier = /^\s*([A-Za-z_]\w*)\s*\/([A-Za-z_]\w*)\b/i.exec(code);
        if (!statementModifier || !this.statements.has(statementModifier[1].toLowerCase())) {
            return undefined;
        }

        return statementModifier.index + statementModifier[0].length - statementModifier[2].length;
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

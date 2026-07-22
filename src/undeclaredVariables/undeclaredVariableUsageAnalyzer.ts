import * as vscode from 'vscode';
import { variableTypes } from '../regExpConstants';
import { GetStatementList } from '../code/getStatementList.use.case';
import { BlockCode } from '../code/getBlockAroundPosition.use.case';

export interface UndeclaredVariableUsage {
    name: string;
    range: vscode.Range;
}

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
        declaredNames: Iterable<string>
    ): UndeclaredVariableUsage[] {
        const declared = new Set([...declaredNames].map((name) => name.toLowerCase()));
        this.addDefinedConstants(block.lines, declared);
        const usages: UndeclaredVariableUsage[] = [];
        let isInsideDeclaration = false;

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

            const code = this.getCodeOutsideStringsAndComments(line).replace(/<[^>]*>/g, (constant) =>
                ' '.repeat(constant.length)
            );
            const callFunctionNameStart = this.getCallFunctionNameStart(code);
            const statementModifierStart = this.getStatementModifierStart(code);
            const tokenRegex = /\b[A-Za-z_]\w*\b/g;
            let match: RegExpExecArray | null;

            while ((match = tokenRegex.exec(code)) !== null) {
                const name = match[0];
                const previousCharacter = code[match.index - 1];
                const isStructField = code.slice(match.index - 2, match.index) === '->';

                if (
                    previousCharacter === '$' ||
                    isStructField ||
                    match.index === callFunctionNameStart ||
                    match.index === statementModifierStart ||
                    declared.has(name.toLowerCase()) ||
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

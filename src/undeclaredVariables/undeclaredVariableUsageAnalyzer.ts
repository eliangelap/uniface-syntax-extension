import * as vscode from 'vscode';
import { BlockCode } from '../code/getBlockAroundPosition.use.case';
import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';
import { GetStatementList } from '../code/getStatementList.use.case';
import { variableTypes } from '../regExpConstants';
import { ExtractionParameterValidator } from './extractionParameterValidator';
import { ProcCodeSanitizer } from './procCodeSanitizer';
import { StatementContextAnalyzer } from './statementContextAnalyzer';
import { UndeclaredVariableUsage } from './undeclaredVariableUsage';
import { unknownLabelDiagnosticCode } from './undeclaredVariablesDiagnosticPublisher';

export { UndeclaredVariableUsage } from './undeclaredVariableUsage';

export class UndeclaredVariableUsageAnalyzer {
    private readonly statements = new Set(
        new GetStatementList().execute().map((statement) => statement.toLowerCase())
    );

    private readonly ignoredWords = new Set(
        [...this.statements, ...variableTypes, 'in', 'inout', 'out', 'true', 'false', 'null'].map(
            (word) => word.toLowerCase()
        )
    );

    private readonly sanitizer = new ProcCodeSanitizer();
    private readonly extractionParameterValidator = new ExtractionParameterValidator();
    private readonly statementContextAnalyzer = new StatementContextAnalyzer(this.statements);

    public getUndeclaredUsages(
        block: BlockCode,
        declaredNames: Iterable<string>,
        returnValueFunctionNames: Iterable<string> = [],
        declaredVariables: Iterable<DeclaredVariable> = []
    ): UndeclaredVariableUsage[] {
        const declared = new Set([...declaredNames].map((name) => name.toLowerCase()));
        const returnValueFunctions = new Set(
            [...returnValueFunctionNames].map((name) => name.toLowerCase())
        );
        const usages: UndeclaredVariableUsage[] = [];
        const labels = this.getLabels(block.lines);
        let isInsideDeclaration = false;

        this.addDefinedConstants(block.lines, declared);
        this.statementContextAnalyzer.reset();

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

            if (
                isInsideDeclaration ||
                /^(entry|operation|trigger|function)\b/i.test(trimmedLine) ||
                /^#(?:include|define|startdefine|enddefine)\b/i.test(trimmedLine)
            ) {
                continue;
            }

            const sanitizedLine = this.sanitizer.sanitize(line);
            this.addUnknownGotoUsage(sanitizedLine, block.startLine + lineIndex, labels, usages);

            const statementContext = this.statementContextAnalyzer.analyze(sanitizedLine);
            const extractionValidation = this.extractionParameterValidator.validate(
                statementContext.code,
                declaredVariables,
                block.startLine + lineIndex
            );
            usages.push(...extractionValidation.invalidUsages);
            this.addTokenUsages(
                extractionValidation.code,
                block.startLine + lineIndex,
                declared,
                returnValueFunctions,
                statementContext.ignoredTokenStarts,
                usages
            );
        }

        return usages;
    }

    private addTokenUsages(
        code: string,
        line: number,
        declared: ReadonlySet<string>,
        returnValueFunctions: ReadonlySet<string>,
        ignoredTokenStarts: ReadonlySet<number>,
        usages: UndeclaredVariableUsage[]
    ): void {
        const tokenRegex = /\b[A-Za-z_]\w*\b/g;
        let match: RegExpExecArray | null;

        while ((match = tokenRegex.exec(code)) !== null) {
            const name = match[0];
            const isFunctionCall = /^\s*\(/.test(code.slice(match.index + name.length));
            if (
                code[match.index - 1] === '$' ||
                ignoredTokenStarts.has(match.index) ||
                declared.has(name.toLowerCase()) ||
                (returnValueFunctions.has(name.toLowerCase()) && isFunctionCall) ||
                this.ignoredWords.has(name.toLowerCase())
            ) {
                continue;
            }

            usages.push({
                name,
                range: new vscode.Range(line, match.index, line, match.index + name.length),
            });
        }
    }

    private addDefinedConstants(lines: string[], declared: Set<string>): void {
        for (const line of lines) {
            const definition = /^\s*#define\s+([A-Za-z_]\w*)\b/i.exec(line);
            if (definition) {
                declared.add(definition[1].toLowerCase());
            }
        }
    }

    private getLabels(lines: string[]): Set<string> {
        const labels = new Set<string>();

        for (const line of lines) {
            const label = /^\s*([A-Za-z_]\w*)\s*:/i.exec(this.sanitizer.sanitize(line));
            if (label) {
                labels.add(label[1].toLowerCase());
            }
        }

        return labels;
    }

    private addUnknownGotoUsage(
        code: string,
        line: number,
        labels: ReadonlySet<string>,
        usages: UndeclaredVariableUsage[]
    ): void {
        const goto = /^\s*goto\s+([A-Za-z_]\w*)\b/i.exec(code);
        if (!goto || labels.has(goto[1].toLowerCase())) {
            return;
        }

        const labelStart = goto.index + goto[0].length - goto[1].length;
        usages.push({
            name: goto[1],
            range: new vscode.Range(line, labelStart, line, labelStart + goto[1].length),
            message: `Label "${goto[1]}" is not declared in this block.`,
            diagnosticCode: unknownLabelDiagnosticCode,
        });
    }
}

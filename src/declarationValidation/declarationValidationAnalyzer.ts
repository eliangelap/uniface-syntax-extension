import * as vscode from 'vscode';
import { findMissingBlockEnds } from '../blockStructure/blockStructureAnalyzer';
import { BlockCode } from '../code/getBlockAroundPosition.use.case';
import { GetBlockList } from '../code/getBlockList.use.case';
import { variableTypes } from '../regExpConstants';
import {
    DeclarationIssue,
    DeclarationValidationDiagnosticPublisher,
    DeclarationValidationDiagnosticPublisherContract,
} from './declarationValidationDiagnosticPublisher';

interface DeclarationValidationDependencies {
    getBlocks(document: vscode.TextDocument): BlockCode[];
}

const defaultDependencies: DeclarationValidationDependencies = {
    getBlocks: (document) => new GetBlockList().execute(document),
};

const dataTypePattern = variableTypes.join('|');
const parameterDeclarationRegex = new RegExp(
    String.raw`^\s*(${dataTypePattern})\s+(\w+)\s*:\s*(?:in|out|inout)\b`,
    'i'
);
const variableDeclarationRegex = new RegExp(String.raw`^\s*(${dataTypePattern})\s+`, 'i');

export class DeclarationValidationAnalyzer implements vscode.Disposable {
    constructor(
        private readonly publisher: DeclarationValidationDiagnosticPublisherContract =
            new DeclarationValidationDiagnosticPublisher(),
        private readonly dependencies: DeclarationValidationDependencies = defaultDependencies
    ) {}

    public analyzeDocument(document: vscode.TextDocument): void {
        if (
            document.languageId !== 'uniface' ||
            findMissingBlockEnds(document.getText().split(/\r?\n/)).length > 0
        ) {
            this.publisher.clear(document);
            return;
        }

        const issues = this.dependencies.getBlocks(document).flatMap((block) =>
            this.findIssues(block)
        );
        this.publisher.publish(document, issues);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.publisher.clear(document);
    }

    public dispose(): void {
        this.publisher.dispose();
    }

    private findIssues(block: BlockCode): DeclarationIssue[] {
        const issues: DeclarationIssue[] = [];
        const declaredNames = new Set<string>();
        let section: 'params' | 'variables' | undefined;

        for (let index = 0; index < block.lines.length; index++) {
            const line = block.lines[index];
            const code = line.split(';', 1)[0];
            const trimmedCode = code.trim();
            const lineNumber = block.startLine + index;

            if (/^params\b/i.test(trimmedCode)) {
                section = 'params';
                continue;
            }
            if (/^variables\b/i.test(trimmedCode)) {
                section = 'variables';
                continue;
            }
            if (/^endparams\b|^endvariables\b/i.test(trimmedCode)) {
                section = undefined;
                continue;
            }
            if (!section || trimmedCode === '') {
                continue;
            }

            if (section === 'params') {
                this.addParameterIssue(code, lineNumber, declaredNames, issues);
                continue;
            }

            this.addVariableIssues(code, lineNumber, declaredNames, issues);
        }

        return issues;
    }

    private addParameterIssue(
        code: string,
        line: number,
        declaredNames: Set<string>,
        issues: DeclarationIssue[]
    ): void {
        const declaration = parameterDeclarationRegex.exec(code);
        if (!declaration) {
            return;
        }

        this.addDuplicateIssue(declaration[2], line, code.indexOf(declaration[2]), declaredNames, issues);
    }

    private addVariableIssues(
        code: string,
        line: number,
        declaredNames: Set<string>,
        issues: DeclarationIssue[]
    ): void {
        const declaration = variableDeclarationRegex.exec(code);
        if (!declaration) {
            return;
        }

        const namesStart = declaration[0].length;
        const names = code.slice(namesStart);
        this.addMissingNameIssues(names, line, namesStart, issues);

        let nameOffset = 0;
        for (const namePart of names.split(',')) {
            const name = namePart.trim();
            if (/^\w+$/.test(name)) {
                this.addDuplicateIssue(
                    name,
                    line,
                    namesStart + nameOffset + namePart.indexOf(name),
                    declaredNames,
                    issues
                );
            }
            nameOffset += namePart.length + 1;
        }
    }

    private addMissingNameIssues(
        names: string,
        line: number,
        namesStart: number,
        issues: DeclarationIssue[]
    ): void {
        const consecutiveCommas = /,\s*(?=,)/g;
        let match: RegExpExecArray | null;

        while ((match = consecutiveCommas.exec(names)) !== null) {
            const commaPosition = namesStart + match.index + match[0].length;
            issues.push({
                kind: 'missingVariableName',
                range: new vscode.Range(line, commaPosition, line, commaPosition + 1),
            });
        }
    }

    private addDuplicateIssue(
        name: string,
        line: number,
        start: number,
        declaredNames: Set<string>,
        issues: DeclarationIssue[]
    ): void {
        const normalizedName = name.toLowerCase();
        if (declaredNames.has(normalizedName)) {
            issues.push({
                kind: 'duplicateVariable',
                name,
                range: new vscode.Range(line, start, line, start + name.length),
            });
            return;
        }

        declaredNames.add(normalizedName);
    }
}

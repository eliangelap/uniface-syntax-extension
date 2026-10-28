import * as vscode from 'vscode';
import { findMissingBlockEnds } from '../blockStructure/blockStructureAnalyzer';
import { MissingBlockEnd } from '../blockStructure/blockStructureDiagnosticPublisher';
import { BlockCode } from '../code/getBlockAroundPosition.use.case';
import { DeclaredVariable, GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import { DeclaredParameter, GetParametersFromBlock } from '../code/getParametersFromBlock.use.case';
import { DeclaredModule } from '../code/types/declaredModule';
import { blockEndRegex, blockStartRegex } from '../regExpConstants';
import { getCodeOutsideStringsAndCommentsLines } from './procCodeScanner';

export interface AnalyzedBlock extends BlockCode {
    variables: DeclaredVariable[];
    parameters: DeclaredParameter[];
}

export interface DocumentAnalysisSnapshot {
    document: vscode.TextDocument;
    version: number;
    lines: string[];
    codeLines: string[];
    blocks: AnalyzedBlock[];
    missingBlockEnds: MissingBlockEnd[];
    modules: DeclaredModule[];
}

/**
 * Immutable analysis input shared by all document-level consumers. It deliberately
 * lives only for one document version so it cannot retain closed documents.
 */
export class DocumentAnalysisSnapshotBuilder {
    public build(document: vscode.TextDocument): DocumentAnalysisSnapshot {
        const lines = document.getText().split(/\r?\n/);
        const codeLines = getCodeOutsideStringsAndCommentsLines(lines);
        const blocks = this.getBlocks(lines, codeLines);

        return {
            document,
            version: document.version,
            lines,
            codeLines,
            blocks,
            missingBlockEnds: findMissingBlockEnds(lines, codeLines),
            modules: this.getModules(codeLines),
        };
    }

    private getBlocks(lines: string[], codeLines: string[]): AnalyzedBlock[] {
        const blocks: AnalyzedBlock[] = [];
        let line = 0;

        while (line < lines.length) {
            if (!blockStartRegex.test(codeLines[line].trim())) {
                line++;
                continue;
            }

            const startLine = line;
            line++;
            while (
                line < lines.length &&
                !blockEndRegex.test(codeLines[line].trim()) &&
                !blockStartRegex.test(codeLines[line].trim())
            ) {
                line++;
            }

            const endLine =
                line < lines.length && blockEndRegex.test(codeLines[line].trim()) ? line : line - 1;
            const blockLines = lines.slice(startLine, Math.max(startLine, endLine) + 1);
            const block: BlockCode = {
                text: blockLines.join('\n'),
                startLine,
                lines: blockLines,
            };

            blocks.push({
                ...block,
                variables: new GetVariablesFromBlock().execute(block),
                parameters: new GetParametersFromBlock().execute(block),
            });

            if (line <= endLine) {
                line = endLine + 1;
            }
        }

        return blocks;
    }

    private getModules(codeLines: string[]): DeclaredModule[] {
        const groups: Record<DeclaredModule['scriptModuleType'], DeclaredModule[]> = {
            trigger: [],
            operation: [],
            entry: [],
            function: [],
        };

        for (let line = 0; line < codeLines.length; line++) {
            const match = /^\s*(entry|operation|function|trigger)\s+(\w+)/i.exec(codeLines[line]);
            if (!match) {
                continue;
            }

            const scriptModuleType = match[1].toLowerCase() as DeclaredModule['scriptModuleType'];
            groups[scriptModuleType].push({ name: match[2], line, scriptModuleType });
        }

        const byName = (a: DeclaredModule, b: DeclaredModule) => {
            const first = a.name.toLowerCase();
            const second = b.name.toLowerCase();
            return first === second ? 0 : first < second ? -1 : 1;
        };
        for (const group of Object.values(groups)) {
            group.sort(byName);
        }

        return [...groups.trigger, ...groups.operation, ...groups.entry, ...groups.function];
    }
}

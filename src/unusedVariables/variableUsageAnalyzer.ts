import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';
import {
    createCodeScannerState,
    getCodeOutsideStringsAndComments,
    getNextCodeScannerState,
} from '../util/procCodeScanner';
import { ProcCodeSanitizer } from '../undeclaredVariables/procCodeSanitizer';

export interface VariableRead {
    name: string;
    line: number;
    start: number;
}

export interface VariableUsageSummary {
    readVariables: Set<string>;
    initializedVariables: Set<string>;
    uninitializedReads: VariableRead[];
}

interface VariableAssignment {
    name: string;
    start: number;
}

export class VariableUsageAnalyzer {
    private readonly sanitizer = new ProcCodeSanitizer();

    public getUsedVariables(
        blockLines: string[],
        declaredVariables: DeclaredVariable[]
    ): Set<string> {
        return this.getUsageSummary(blockLines, declaredVariables).readVariables;
    }

    public getUsageSummary(
        blockLines: string[],
        declaredVariables: DeclaredVariable[]
    ): VariableUsageSummary {
        const readVariables = new Set<string>();
        const initializedVariables = new Set<string>();
        const uninitializedReads: VariableRead[] = [];
        const declaredByName = new Map(
            declaredVariables.map((variable) => [variable.name.toLowerCase(), variable.name])
        );
        const interpolatedVariables = this.sanitizer.getInterpolatedVariables(blockLines);
        let isAfterVariablesBlock = false;
        let state = createCodeScannerState();

        for (let lineIndex = 0; lineIndex < blockLines.length; lineIndex++) {
            const line = blockLines[lineIndex];
            const trimmedLine = line.trim();

            if (!isAfterVariablesBlock) {
                if (/^endvariables\b(?:\s*;.*)?$/i.test(trimmedLine)) {
                    isAfterVariablesBlock = true;
                }
                continue;
            }

            const scanResult = getCodeOutsideStringsAndComments(line, state);
            state = getNextCodeScannerState(line, scanResult.state);
            const code = scanResult.code;
            const assignment = this.getAssignment(code, declaredByName);
            const tokenRegex = /\b[A-Za-z_]\w*\b/g;
            let token: RegExpExecArray | null;
            while ((token = tokenRegex.exec(code)) !== null) {
                const declaredName = declaredByName.get(token[0].toLowerCase());
                if (declaredName && token.index !== assignment?.start) {
                    this.addRead(
                        declaredName,
                        lineIndex,
                        token.index,
                        initializedVariables,
                        readVariables,
                        uninitializedReads
                    );
                }
            }

            for (const variable of interpolatedVariables[lineIndex]) {
                const declaredName = declaredByName.get(variable.name.toLowerCase());
                if (declaredName) {
                    this.addRead(
                        declaredName,
                        lineIndex,
                        variable.start,
                        initializedVariables,
                        readVariables,
                        uninitializedReads
                    );
                }
            }

            if (assignment) {
                initializedVariables.add(assignment.name);
            }
        }

        return { readVariables, initializedVariables, uninitializedReads };
    }

    private getAssignment(
        code: string,
        declaredByName: ReadonlyMap<string, string>
    ): VariableAssignment | undefined {
        const assignment = /^\s*([A-Za-z_]\w*)\s*=/.exec(code);
        if (!assignment) {
            return undefined;
        }

        const name = declaredByName.get(assignment[1].toLowerCase());
        if (!name) {
            return undefined;
        }

        return { name, start: assignment.index + assignment[0].indexOf(assignment[1]) };
    }

    private addRead(
        name: string,
        line: number,
        start: number,
        initializedVariables: ReadonlySet<string>,
        readVariables: Set<string>,
        uninitializedReads: VariableRead[]
    ): void {
        readVariables.add(name);
        if (
            !initializedVariables.has(name) &&
            !uninitializedReads.some((usage) => usage.name === name)
        ) {
            uninitializedReads.push({ name, line, start });
        }
    }
}

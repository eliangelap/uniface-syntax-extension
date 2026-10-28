import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';
import { DeclaredParameter, ParameterDirection } from '../code/getParametersFromBlock.use.case';
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

interface InvocationEffect extends VariableAssignment {
    line: number;
    read: boolean;
    write: boolean;
    writeLine: number;
}

interface InvocationArgument {
    text: string;
    positions: Array<{ line: number; start: number } | undefined>;
}

interface PendingInvocation {
    name: string;
    kind: 'call' | 'activate';
    arguments: InvocationArgument[];
    depth: number;
}

interface CallableBlock {
    lines: string[];
    parameters: readonly DeclaredParameter[];
}

export interface CallableSignatures {
    calls: ReadonlyMap<string, readonly ParameterDirection[]>;
    activations: ReadonlyMap<string, readonly ParameterDirection[]>;
}

const emptyCallableSignatures: CallableSignatures = {
    calls: new Map(),
    activations: new Map(),
};

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
        declaredVariables: DeclaredVariable[],
        callableSignatures: CallableSignatures = emptyCallableSignatures
    ): VariableUsageSummary {
        const readVariables = new Set<string>();
        const initializedVariables = new Set<string>();
        const uninitializedReads: VariableRead[] = [];
        const declaredByName = new Map(
            declaredVariables.map((variable) => [variable.name.toLowerCase(), variable.name])
        );
        const invocationEffects = this.getInvocationEffects(
            blockLines,
            declaredByName,
            callableSignatures
        );
        const invocationEffectsByPosition = new Map(
            invocationEffects.map((effect) => [`${effect.line}:${effect.start}`, effect])
        );
        const invocationWritesByLine = new Map<number, InvocationEffect[]>();
        for (const effect of invocationEffects) {
            if (effect.write) {
                const writes = invocationWritesByLine.get(effect.writeLine) ?? [];
                writes.push(effect);
                invocationWritesByLine.set(effect.writeLine, writes);
            }
        }
        const interpolatedVariables = this.sanitizer.getInterpolatedVariables(blockLines);
        let isAfterVariablesBlock = false;
        let isInsideSelectdb = false;
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
            const selectdb = this.getSelectdbDestination(code, isInsideSelectdb, declaredByName);
            isInsideSelectdb = selectdb.isInside;
            const writeTargets = [assignment, selectdb.destination].filter(
                (target): target is VariableAssignment => target !== undefined
            );
            const tokenRegex = /\b[A-Za-z_]\w*\b/g;
            let token: RegExpExecArray | null;
            while ((token = tokenRegex.exec(code)) !== null) {
                const declaredName = declaredByName.get(token[0].toLowerCase());
                const tokenStart = token.index;
                const invocationEffect = invocationEffectsByPosition.get(`${lineIndex}:${tokenStart}`);
                if (
                    declaredName &&
                    !writeTargets.some((target) => tokenStart === target.start) &&
                    invocationEffect?.read !== false
                ) {
                    this.addRead(
                        declaredName,
                        lineIndex,
                        tokenStart,
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

            for (const target of writeTargets) {
                initializedVariables.add(target.name);
            }

            for (const effect of invocationWritesByLine.get(lineIndex) ?? []) {
                initializedVariables.add(effect.name);
            }
        }

        return { readVariables, initializedVariables, uninitializedReads };
    }

    public getCallableSignatures(blocks: readonly CallableBlock[]): CallableSignatures {
        const calls = new Map<string, ParameterDirection[][]>();
        const activations = new Map<string, ParameterDirection[][]>();

        for (const block of blocks) {
            const module = /^\s*(entry|operation)\s+([A-Za-z_]\w*)\b/i.exec(block.lines[0] ?? '');
            if (!module) {
                continue;
            }

            const signatures = module[1].toLowerCase() === 'entry' ? calls : activations;
            const name = module[2].toLowerCase();
            const candidates = signatures.get(name) ?? [];
            candidates.push(block.parameters.map((parameter) => parameter.direction));
            signatures.set(name, candidates);
        }

        return {
            calls: this.getUniqueSignatures(calls),
            activations: this.getUniqueSignatures(activations),
        };
    }

    private getUniqueSignatures(
        candidates: ReadonlyMap<string, ParameterDirection[][]>
    ): ReadonlyMap<string, readonly ParameterDirection[]> {
        return new Map(
            [...candidates]
                .filter(([, signatures]) => signatures.length === 1)
                .map(([name, signatures]) => [name, signatures[0]])
        );
    }

    private getInvocationEffects(
        blockLines: string[],
        declaredByName: ReadonlyMap<string, string>,
        callableSignatures: CallableSignatures
    ): InvocationEffect[] {
        const effects: InvocationEffect[] = [];
        let scannerState = createCodeScannerState();
        let invocation: PendingInvocation | undefined;

        for (let line = 0; line < blockLines.length; line++) {
            const scanResult = getCodeOutsideStringsAndComments(blockLines[line], scannerState);
            scannerState = getNextCodeScannerState(blockLines[line], scanResult.state);
            const code = scanResult.code;

            if (!invocation) {
                const start = this.getInvocationStart(code);
                if (!start) {
                    continue;
                }

                invocation = {
                    name: start.name,
                    kind: start.kind,
                    arguments: [{ text: '', positions: [] }],
                    depth: 0,
                };
                const isClosed = this.consumeInvocationCode(
                    code.slice(start.argumentsStart),
                    line,
                    start.argumentsStart,
                    invocation,
                    declaredByName,
                    callableSignatures,
                    effects
                );
                if (isClosed) {
                    invocation = undefined;
                }
                continue;
            }

            const isClosed = this.consumeInvocationCode(
                code,
                line,
                0,
                invocation,
                declaredByName,
                callableSignatures,
                effects
            );

            if (isClosed) {
                invocation = undefined;
            }
        }

        return effects;
    }

    private getInvocationStart(
        code: string
    ): { kind: 'call' | 'activate'; name: string; argumentsStart: number } | undefined {
        const call = /\bcall\s+([A-Za-z_]\w*)\s*\(/i.exec(code);
        const activate = /\bactivate(?:\s*\/[A-Za-z_]\w*)*\s+.*?\.\s*([A-Za-z_]\w*)\s*\(/i.exec(code);
        const match = [
            call && { kind: 'call' as const, match: call },
            activate && { kind: 'activate' as const, match: activate },
        ]
            .filter((candidate): candidate is { kind: 'call' | 'activate'; match: RegExpExecArray } =>
                Boolean(candidate)
            )
            .sort((first, second) => first.match.index - second.match.index)[0];
        if (!match) {
            return undefined;
        }

        return {
            kind: match.kind,
            name: match.match[1],
            argumentsStart: match.match.index + match.match[0].lastIndexOf('(') + 1,
        };
    }

    private consumeInvocationCode(
        code: string,
        line: number,
        start: number,
        invocation: PendingInvocation,
        declaredByName: ReadonlyMap<string, string>,
        callableSignatures: CallableSignatures,
        effects: InvocationEffect[]
    ): boolean {
        for (let index = 0; index < code.length; index++) {
            if (code[index] === '%' && code[index + 1] === '\\') {
                index++;
                continue;
            }

            const argument = invocation.arguments[invocation.arguments.length - 1];
            if (code[index] === '(') {
                invocation.depth++;
            } else if (code[index] === ')' && invocation.depth === 0) {
                this.addInvocationEffects(invocation, line, declaredByName, callableSignatures, effects);
                return true;
            } else if (code[index] === ')') {
                invocation.depth--;
            } else if (code[index] === ',' && invocation.depth === 0) {
                invocation.arguments.push({ text: '', positions: [] });
                continue;
            }

            argument.text += code[index];
            argument.positions.push({ line, start: start + index });
        }

        return false;
    }

    private addInvocationEffects(
        invocation: PendingInvocation,
        writeLine: number,
        declaredByName: ReadonlyMap<string, string>,
        callableSignatures: CallableSignatures,
        effects: InvocationEffect[]
    ): void {
        const directions =
            invocation.kind === 'call'
                ? callableSignatures.calls.get(invocation.name.toLowerCase())
                : callableSignatures.activations.get(invocation.name.toLowerCase());

        for (const [index, argument] of invocation.arguments.entries()) {
            const nameMatch = /^\s*([A-Za-z_]\w*)\s*$/.exec(argument.text);
            if (!nameMatch) {
                continue;
            }

            const name = declaredByName.get(nameMatch[1].toLowerCase());
            const position = argument.positions[nameMatch.index + nameMatch[0].indexOf(nameMatch[1])];
            if (!name || !position) {
                continue;
            }

            const direction = directions ? (directions[index] ?? 'in') : 'out';
            effects.push({
                name,
                start: position.start,
                line: position.line,
                read: direction !== 'out',
                write: direction !== 'in',
                writeLine,
            });
        }
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

    private getSelectdbDestination(
        code: string,
        wasInsideSelectdb: boolean,
        declaredByName: ReadonlyMap<string, string>
    ): { destination: VariableAssignment | undefined; isInside: boolean } {
        const isSelectdb = wasInsideSelectdb || /^\s*selectdb\b/i.test(code);
        if (!isSelectdb) {
            return { destination: undefined, isInside: false };
        }

        const destination = /\bto\s+([A-Za-z_]\w*)\b/i.exec(code);
        const name = destination && declaredByName.get(destination[1].toLowerCase());

        return {
            destination: name
                ? {
                      name,
                      start: destination.index + destination[0].lastIndexOf(destination[1]),
                  }
                : undefined,
            isInside: /%\\\s*$/.test(code),
        };
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

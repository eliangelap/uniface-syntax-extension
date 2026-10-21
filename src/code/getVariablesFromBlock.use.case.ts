import { variableRegex } from '../regExpConstants';
import { BlockCode } from './getBlockAroundPosition.use.case';
import { DeclaredItem } from './types/declaredModule';
import { getCodeOutsideStringsAndCommentsLines } from '../util/procCodeScanner';

export interface DeclaredVariable extends DeclaredItem {
    dataType: string;
}

export class GetVariablesFromBlock {
    public execute = (block: BlockCode): DeclaredVariable[] => {
        let inVariableBlock = false;
        const variables: DeclaredVariable[] = [];
        const blockStartLine = block.startLine;

        const codeLines = getCodeOutsideStringsAndCommentsLines(block.lines);

        for (let i = 0; i < codeLines.length; i++) {
            const line = codeLines[i].trim();
            if (/^variables\b(?:\s*;.*)?$/i.test(line)) {
                inVariableBlock = true;
                continue;
            }

            if (!inVariableBlock) {
                continue;
            }

            if (/^endvariables\b(?:\s*;.*)?$/i.test(line)) {
                break;
            }

            variables.push(...this.extractVariables(line, blockStartLine + i));
        }

        return variables;
    };

    private readonly extractVariables = (codeLine: string, lineNumber: number): DeclaredVariable[] => {
        const variables: DeclaredVariable[] = [];
        const declaration = codeLine.split(';', 1)[0].trim();
        const varMatch = new RegExp(`^${variableRegex}`, 'i').exec(declaration);

        if (!varMatch) {
            return variables;
        }

        const variableNames = declaration
            .slice(varMatch[1].length)
            .split(',')
            .map((name) => name.trim())
            .filter((name) => /^\w+$/.test(name));

        for (const name of variableNames) {
            variables.push({
                dataType: varMatch[1],
                name,
                line: lineNumber,
            });
        }

        return variables;
    };
}

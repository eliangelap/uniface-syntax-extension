import { variableRegex } from "../regExpConstants";
import { BlockCode } from "./getBlockAroundPosition.use.case";

export interface DeclaredItem {
    name: string;
    line: number;
}
export interface DeclaredVariable extends DeclaredItem {
    dataType: string;
}
export interface DeclaredModule extends DeclaredItem {
    scriptModuleType: string;
}

export class GetVariablesFromBlock {
    public execute = (block: BlockCode): DeclaredVariable[] => {
        let inVariableBlock = false;
        const variables = [];
        const blockStartLine = block.startLine;

        for (let i = 0; i < block.lines.length; i++) {
            const line = block.lines[i].trim();
            const lineLower = line.toLowerCase();

            if (lineLower === "variables") {
                inVariableBlock = true;
                continue;
            }

            if (!inVariableBlock) {
                continue;
            }

            if (lineLower === "endvariables") {
                break;
            }

            variables.push(...this.extractVariables(line, blockStartLine + i));
        }

        return variables;
    };

    private extractVariables = (
        codeLine: string,
        lineNumber: number
    ): DeclaredVariable[] => {
        const variables = [];

        const varMatch = RegExp(variableRegex, "i").exec(codeLine.trim());

        if (varMatch) {
            const variableNames = varMatch?.input
                ?.replace(`${varMatch[1]}`, "")
                ?.split(",");
            if (variableNames) {
                for (const variableName of variableNames) {
                    if (variableName.startsWith(";")) {
                        continue;
                    }

                    const item = {
                        dataType: varMatch[1],
                        name: variableName.trim().split(";")[0],
                        line: lineNumber,
                    };
                    variables.push(item);
                }
            }
        }

        return variables;
    };
}

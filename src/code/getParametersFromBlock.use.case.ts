import { variableRegex } from "../regExpConstants";
import { BlockCode } from "./getBlockAroundPosition.use.case";
import { DeclaredVariable } from "./getVariablesFromBlock.use.case";

export class GetParametersFromBlock {
    public execute = (block: BlockCode): DeclaredVariable[] => {
        const paramRegex = /params([\s\S]*?)endparams/gi;
        const matchParamsBlock = paramRegex.exec(block.text);
        const parameters = [];

        const lineStartBlock = block.startLine;

        if (matchParamsBlock) {
            const paramLines = matchParamsBlock[1].split("\n");
            for (let i = 0; i < paramLines.length; i++) {
                const lineText = paramLines[i];
                const paramMatch = RegExp(
                    /(\$?\w+\$?)\s*:\s*(in|out|inout)/i
                ).exec(lineText.trim());

                if (!paramMatch) {
                    continue;
                }

                const varMatch = RegExp(variableRegex, "i").exec(lineText.trim());
                if (!varMatch) {
                    continue;
                }

                const item = {
                    dataType: varMatch[1],
                    name: varMatch[2].trim(),
                    line: lineStartBlock + i,
                };
                parameters.push(item);
            }
        }

        return parameters;
    };
}

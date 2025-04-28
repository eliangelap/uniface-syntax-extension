import { BlockCode } from './getBlockAroundPosition.use.case';
import { DeclaredVariable } from './getVariablesFromBlock.use.case';

export class GetParametersFromBlock {
    public execute = (block: BlockCode): DeclaredVariable[] => {
        const paramRegex = /params([\s\S]*?)endparams/gi;
        const matchParamsBlock = paramRegex.exec(block.text);
        const parameters = [];

        const lineStartBlock = block.startLine;

        if (matchParamsBlock) {
            const paramLines = matchParamsBlock[1].split('\n');
            for (let i = 0; i < paramLines.length; i++) {
                const line = paramLines[i];
                const paramMatch = RegExp(
                    /(\$?\w+\$?)\s*:\s*(in|out|inout)/i
                ).exec(line.trim());

                if (paramMatch) {
                    const item = {
                        name: paramMatch[1].trim(),
                        line: lineStartBlock + i,
                    };
                    parameters.push(item);
                }
            }
        }

        return parameters;
    };
}

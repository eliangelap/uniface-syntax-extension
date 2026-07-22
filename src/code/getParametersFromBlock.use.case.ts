import { variableRegex } from '../regExpConstants';
import { CodeAnalyzer } from '../util/codeAnalyzer.use.case';
import { BlockCode } from './getBlockAroundPosition.use.case';
import { DeclaredVariable } from './getVariablesFromBlock.use.case';

export class GetParametersFromBlock {
    public execute = (block: BlockCode): DeclaredVariable[] => {
        const parameters: DeclaredVariable[] = [];
        const parameterRegex = RegExp(`^${variableRegex}\\s*:\\s*(in|out|inout)\\b`, 'i');
        let inParametersBlock = false;

        for (let i = 0; i < block.lines.length; i++) {
            const lineText = block.lines[i].trim();

            if (CodeAnalyzer.isLineCommented(lineText)) {
                continue;
            }

            if (/^params\b(?:\s*;.*)?$/i.test(lineText)) {
                inParametersBlock = true;
                continue;
            }

            if (!inParametersBlock) {
                continue;
            }

            if (/^endparams\b(?:\s*;.*)?$/i.test(lineText)) {
                break;
            }

            const parameterMatch = parameterRegex.exec(lineText);
            if (!parameterMatch) {
                continue;
            }

            parameters.push({
                dataType: parameterMatch[1],
                name: parameterMatch[2],
                line: block.startLine + i,
            });
        }

        return parameters;
    };
}

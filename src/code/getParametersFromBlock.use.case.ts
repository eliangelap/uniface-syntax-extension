import { variableRegex } from '../regExpConstants';
import { CodeAnalyzer } from '../util/codeAnalyzer.use.case';
import { BlockCode } from './getBlockAroundPosition.use.case';
import { DeclaredVariable } from './getVariablesFromBlock.use.case';
import { getCodeOutsideStringsAndCommentsLines } from '../util/procCodeScanner';

export type ParameterDirection = 'in' | 'out' | 'inout';

export interface DeclaredParameter extends DeclaredVariable {
    direction: ParameterDirection;
}

export class GetParametersFromBlock {
    public execute = (block: BlockCode): DeclaredParameter[] => {
        const parameters: DeclaredParameter[] = [];
        const parameterRegex = RegExp(`^${variableRegex}\\s*:\\s*(in|out|inout)\\b`, 'i');
        let inParametersBlock = false;

        const codeLines = getCodeOutsideStringsAndCommentsLines(block.lines);

        for (let i = 0; i < codeLines.length; i++) {
            const lineText = codeLines[i].trim();

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
                direction: parameterMatch[3].toLowerCase() as ParameterDirection,
            });
        }

        return parameters;
    };
}

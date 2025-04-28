import { BlockCode } from './getBlockAroundPosition.use.case';

export interface DeclaredVariable {
    name: string;
    line: number;
}

export class GetVariablesFromBlock {
    public execute = (block: BlockCode): DeclaredVariable[] => {
        const variableRegex = /variables([\s\S]*?)endvariables/gi;
        const matchVariablesBlock = variableRegex.exec(block.text);
        const variables = [];

        const lineStartBlock = block.startLine;

        if (matchVariablesBlock) {
            const varLines = matchVariablesBlock[1].split('\n');
            for (const line of varLines) {
                const varMatch = RegExp(
                    /(ANY|BOOLEAN|DATE|DATETIME|ENTITY|FLOAT|HANDLE|IMAGE|LINEARDATE|LINEARDATETIME|LINEARTIME|NUMERIC|OCCURRENCE|RAW|STRING|STRUCT|TIME|XMLSTREAM)\s+(\w+)/i
                ).exec(line.trim());
                if (varMatch) {
                    const variableNames = varMatch?.input
                        ?.replace(`${varMatch[1]}`, '')
                        ?.split(',');
                    if (variableNames) {
                        for (let i = 0; i < variableNames.length; i++) {
                            const variableName = variableNames[i];
                            const item = {
                                name: variableName.trim(),
                                line: lineStartBlock + i,
                            };
                            variables.push(item);
                        }
                    }
                }
            }
        }

        return variables;
    };
}

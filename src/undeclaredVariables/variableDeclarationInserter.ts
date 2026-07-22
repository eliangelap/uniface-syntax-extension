import { BlockCode } from '../code/getBlockAroundPosition.use.case';

export interface VariableDeclarationInsertion {
    line: number;
    text: string;
}

export class VariableDeclarationInserter {
    public create(block: BlockCode, name: string, dataType: string): VariableDeclarationInsertion {
        const variablesStart = block.lines.findIndex((line) => /^\s*variables\b/i.test(line));
        const variablesEnd = block.lines.findIndex((line, index) => {
            return index > variablesStart && /^\s*endvariables\b/i.test(line);
        });

        if (variablesStart >= 0 && variablesEnd >= 0) {
            const indentation = this.getIndentation(block.lines[variablesStart]);

            return {
                line: block.startLine + variablesEnd,
                text: `${indentation}    ${dataType} ${name}\n`,
            };
        }

        const parametersEnd = block.lines.findIndex((line) => /^\s*endparams\b/i.test(line));
        const declarationLine = parametersEnd >= 0 ? parametersEnd : 0;
        const indentation = this.getIndentation(block.lines[declarationLine]);

        return {
            line: block.startLine + declarationLine + 1,
            text: `${indentation}variables\n${indentation}    ${dataType} ${name}\n${indentation}endvariables\n`,
        };
    }

    private getIndentation(line: string): string {
        return line.match(/^\s*/)?.[0] ?? '';
    }
}

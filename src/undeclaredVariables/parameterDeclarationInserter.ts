import { BlockCode } from '../code/getBlockAroundPosition.use.case';

export type ParameterDirection = 'in' | 'out' | 'inout';

export interface ParameterDeclarationInsertion {
    line: number;
    character: number;
    text: string;
}

export class ParameterDeclarationInserter {
    public create(
        block: BlockCode,
        name: string,
        dataType: string,
        direction: ParameterDirection
    ): ParameterDeclarationInsertion {
        const parametersStart = block.lines.findIndex((line) => /^\s*params\b/i.test(line));
        const parametersEnd = block.lines.findIndex((line, index) => {
            return index > parametersStart && /^\s*endparams\b/i.test(line);
        });

        if (parametersStart >= 0 && parametersEnd >= 0) {
            const indentation = this.getIndentation(block.lines[parametersStart]);

            return {
                line: block.startLine + parametersEnd,
                character: 0,
                text: `${indentation}    ${dataType} ${name} : ${direction}\n`,
            };
        }

        const variablesStart = block.lines.findIndex((line) => /^\s*variables\b/i.test(line));
        const insertionLine = variablesStart >= 0 ? variablesStart : 1;
        const indentation = this.getIndentation(
            block.lines[variablesStart >= 0 ? variablesStart : this.findFirstContentLine(block.lines)]
        );

        return {
            line: block.startLine + insertionLine,
            character: 0,
            text: `${indentation}params\n${indentation}    ${dataType} ${name} : ${direction}\n${indentation}endparams\n`,
        };
    }

    private getIndentation(line: string): string {
        return new RegExp(/^\s*/).exec(line)?.[0] ?? '';
    }

    private findFirstContentLine(lines: string[]): number {
        const firstContentLine = lines.findIndex((line, index) => index > 0 && line.trim().length > 0);

        return firstContentLine >= 0 ? firstContentLine : 0;
    }
}

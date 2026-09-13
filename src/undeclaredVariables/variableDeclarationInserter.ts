import { BlockCode } from '../code/getBlockAroundPosition.use.case';

export interface VariableDeclarationInsertion {
    line: number;
    character: number;
    text: string;
}

export class VariableDeclarationInserter {
    public create(block: BlockCode, name: string, dataType: string): VariableDeclarationInsertion {
        const variablesStart = block.lines.findIndex((line) => /^\s*variables\b/i.test(line));
        const variablesEnd = block.lines.findIndex((line, index) => {
            return index > variablesStart && /^\s*endvariables\b/i.test(line);
        });

        if (variablesStart >= 0 && variablesEnd >= 0) {
            const matchingDeclarationLine = this.findLastMatchingDeclarationLine(
                block.lines,
                variablesStart,
                variablesEnd,
                dataType
            );

            if (matchingDeclarationLine >= 0) {
                const declarationLine = block.lines[matchingDeclarationLine];
                const commentStart = declarationLine.indexOf(';');
                const declarationEnd = commentStart >= 0 ? commentStart : declarationLine.length;

                return {
                    line: block.startLine + matchingDeclarationLine,
                    character: declarationLine.slice(0, declarationEnd).trimEnd().length,
                    text: `, ${name}`,
                };
            }

            const indentation = this.getIndentation(block.lines[variablesStart]);

            return {
                line: block.startLine + variablesEnd,
                character: 0,
                text: `${indentation}    ${dataType} ${name}\n`,
            };
        }

        const parametersEnd = block.lines.findIndex((line) => /^\s*endparams\b/i.test(line));
        const declarationLine = Math.max(parametersEnd, 0);
        const indentation = this.getIndentation(block.lines[declarationLine]);

        return {
            line: block.startLine + declarationLine + 1,
            character: 0,
            text: `${indentation}variables\n${indentation}    ${dataType} ${name}\n${indentation}endvariables\n`,
        };
    }

    private findLastMatchingDeclarationLine(
        lines: string[],
        variablesStart: number,
        variablesEnd: number,
        dataType: string
    ): number {
        for (let index = variablesEnd - 1; index > variablesStart; index--) {
            if (this.isMatchingDeclaration(lines[index], dataType)) {
                return index;
            }
        }

        return -1;
    }

    private isMatchingDeclaration(line: string, dataType: string): boolean {
        const declaration = line.split(';', 1)[0].trim();
        const match = /^(\w+)\s+(.+)$/.exec(declaration);

        if (!match || match[1].toLowerCase() !== dataType.toLowerCase()) {
            return false;
        }

        return match[2].split(',').every((name) => /^\w+$/.test(name.trim()));
    }

    private getIndentation(line: string): string {
        return new RegExp(/^\s*/).exec(line)?.[0] ?? '';
    }
}

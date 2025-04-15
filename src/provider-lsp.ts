import * as vscode from 'vscode';

export class CompletionItemProvider implements vscode.CompletionItemProvider {
    private getBlockAroundPosition(
        document: vscode.TextDocument,
        position: vscode.Position
    ): string {
        const text = document.getText();
        const cursorOffset = document.offsetAt(position);

        // Localiza o início do bloco (entry|trigger) antes do cursor
        let blockStart = text.lastIndexOf('entry ', cursorOffset);
        const triggerStart = text.lastIndexOf('trigger ', cursorOffset);
        const operationStart = text.lastIndexOf('operation ', cursorOffset);
        const functionStart = text.lastIndexOf('function ', cursorOffset);

        blockStart = Math.max(
            blockStart,
            triggerStart,
            operationStart,
            functionStart
        );

        if (blockStart < 0) {
            return '';
        }

        // Localiza o fim do bloco (end) depois do cursor
        let blockEnd = text.indexOf('end', cursorOffset);

        if (blockEnd < 0) {
            blockEnd = text.length;
        }

        const subString = text.substring(blockStart, blockEnd);

        if (
            !subString.includes('variables') &&
            !subString.includes('params') &&
            !subString.includes('endvariables') &&
            !subString.includes('endparams')
        ) {
            return '';
        }

        const endRegex = /(^|\s)end(\s|;|$)/;
        if (endRegex.test(subString)) {
            return '';
        }

        return text.substring(blockStart, blockEnd);
    }

    private getParametersFromBlock = (
        blockText: string
    ): vscode.CompletionItem[] => {
        const paramRegex = /params([\s\S]*?)endparams/gi;
        const matchParamsBlock = paramRegex.exec(blockText);
        const parameters = [];

        if (matchParamsBlock) {
            const paramLines = matchParamsBlock[1].split('\n');
            for (const line of paramLines) {
                const paramMatch = RegExp(
                    /(\$?\w+\$?)\s*:\s*(in|out|inout)/i
                ).exec(line.trim());

                if (paramMatch) {
                    const item = new vscode.CompletionItem(
                        paramMatch[1].trim(),
                        vscode.CompletionItemKind.Variable
                    );
                    parameters.push(item);
                }
            }
        }

        return parameters;
    };

    private getVariablesFromBlock = (
        blockText: string
    ): vscode.CompletionItem[] => {
        const variableRegex = /variables([\s\S]*?)endvariables/gi;
        const matchVariablesBlock = variableRegex.exec(blockText);
        const variables = [];

        if (matchVariablesBlock) {
            const varLines = matchVariablesBlock[1].split('\n');
            for (const line of varLines) {
                const varMatch = RegExp(/(ANY|BOOLEAN|DATE|DATETIME|ENTITY|FLOAT|HANDLE|IMAGE|LINEARDATE|LINEARDATETIME|LINEARTIME|NUMERIC|OCCURRENCE|RAW|STRING|STRUCT|TIME|XMLSTREAM)\s+(\w+)/i).exec(line
                    .trim());
                if (varMatch) {
                    const variableNames = varMatch?.input
                        ?.replace(`${varMatch[1]}`, '')
                        ?.split(',');
                    if (variableNames) {
                        for (const variableName of variableNames) {
                            const item = new vscode.CompletionItem(
                                variableName.trim(),
                                vscode.CompletionItemKind.Variable
                            );
                            variables.push(item);
                        }
                    }
                }
            }
        }

        return variables;
    };

    private getEntriesList(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completions = [];
        const entries: string[] =
            document.getText().match(/entry\s+(\w+)/gi) || [];

        const lineText = document.lineAt(position).text;

        if (lineText.includes('call')) {
            const entryItems = entries.map((entry) => {
                const entryName = entry.replace('entry', '').trim();
                return new vscode.CompletionItem(
                    entryName,
                    vscode.CompletionItemKind.Method
                );
            });
            completions.push(...entryItems);
        }

        return completions;
    }

    public provideCompletionItems = (
        document: vscode.TextDocument,
        position: vscode.Position
    ) => {
        const completions = [];

        const entries = this.getEntriesList(document, position);
        if (entries.length > 0) {
            completions.push(...entries);
            return completions;
        }

        const blockText = this.getBlockAroundPosition(document, position);

        if (!blockText) {
            return [];
        }

        completions.push(...this.getVariablesFromBlock(blockText));
        completions.push(...this.getParametersFromBlock(blockText));

        return completions;
    };
}

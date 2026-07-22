import * as vscode from 'vscode';
import { DeclaredVariable } from './getVariablesFromBlock.use.case';

export class VariablesToCompletionItems {
    public execute(
        declaredVariables: DeclaredVariable[],
        dollarPrefixedTokenRange?: vscode.Range
    ): vscode.CompletionItem[] {
        const completionItems: vscode.CompletionItem[] = [];
        const variableNames = new Set<string>();

        for (const declaredVariable of declaredVariables) {
            const variableName = declaredVariable.name;
            const normalizedName = variableName.toLowerCase();

            if (variableNames.has(normalizedName)) {
                continue;
            }

            variableNames.add(normalizedName);
            const completionItem = new vscode.CompletionItem(
                `${declaredVariable.dataType} ${variableName}`,
                vscode.CompletionItemKind.Variable
            );

            completionItem.insertText = variableName;

            if (variableName.startsWith('$') && dollarPrefixedTokenRange) {
                completionItem.range = dollarPrefixedTokenRange;
            }

            completionItems.push(completionItem);
        }

        return completionItems;
    }
}

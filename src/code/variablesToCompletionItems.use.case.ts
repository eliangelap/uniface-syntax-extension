import * as vscode from 'vscode';
import { DeclaredVariable } from './getVariablesFromBlock.use.case';

export class VariablesToCompletionItems {
    public execute(
        declaredVariables: DeclaredVariable[],
        itemKind: vscode.CompletionItemKind
    ) {
        const completionItems = [];
        for (let declaredVariable of declaredVariables) {
            completionItems.push(
                new vscode.CompletionItem(declaredVariable.name, itemKind)
            );
        }

        return completionItems;
    }
}

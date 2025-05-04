import * as vscode from "vscode";
import { DeclaredVariable } from "./getVariablesFromBlock.use.case";

export class VariablesToCompletionItems {
    public execute(declaredVariables: DeclaredVariable[]) {
        const completionItems = [];
        for (let declaredVariable of declaredVariables) {
            const variableName = declaredVariable.name;
            const completionItem = new vscode.CompletionItem(
                variableName,
                vscode.CompletionItemKind.Variable
            );

            completionItem.insertText = variableName.startsWith("$")
                ? variableName.substring(1)
                : variableName;

            completionItems.push(
                completionItem
            );
        }

        return completionItems;
    }
}

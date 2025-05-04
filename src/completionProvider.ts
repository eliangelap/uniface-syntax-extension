import * as vscode from "vscode";
import { GetBlockAroundPostion } from "./code/getBlockAroundPosition.use.case";
import { GetEntriesList } from "./code/getEntriesList.use.case";
import { GetParametersFromBlock } from "./code/getParametersFromBlock.use.case";
import { GetVariablesFromBlock } from "./code/getVariablesFromBlock.use.case";
import { VariablesToCompletionItems } from "./code/variablesToCompletionItems.use.case";
import { GetReservedFunctionList } from "./code/getReservedFunctionList.use.case";
import { StringListToCompletionItems } from "./code/stringListToCompletionItems.use.case";

export class CompletionItemProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems = (
        document: vscode.TextDocument,
        position: vscode.Position
    ) => {
        const completions = [];

        const entries = new GetEntriesList().execute(document, position);

        if (entries.length > 0) {
            completions.push(...entries);
            return completions;
        }

        const blockText = new GetBlockAroundPostion().execute(
            document,
            position
        );

        if (!blockText) {
            return [];
        }

        const parameters = new GetParametersFromBlock().execute(blockText);
        const variables = new GetVariablesFromBlock().execute(blockText);
        const reservedFunctions = new GetReservedFunctionList().execute();

        completions.push(
            ...new VariablesToCompletionItems().execute(parameters)
        );
        completions.push(
            ...new VariablesToCompletionItems().execute(variables)
        );

        const lineText = document.lineAt(position).text.trim();
        if (lineText.includes("$")) {
            completions.push(
                ...new StringListToCompletionItems().execute(
                    reservedFunctions,
                    vscode.CompletionItemKind.Method
                )
            );
        }

        return completions;
    };
}
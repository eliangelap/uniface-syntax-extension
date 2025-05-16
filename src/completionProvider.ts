import * as vscode from "vscode";
import { GetBlockAroundPostion } from "./code/getBlockAroundPosition.use.case";
import { GetEntriesCompletionList } from "./code/getEntriesCompletionList.use.case";
import { GetParametersFromBlock } from "./code/getParametersFromBlock.use.case";
import { GetUnifaceProcFunctionList } from "./code/getUnifaceProcFunctionList.use.case";
import { GetVariablesFromBlock } from "./code/getVariablesFromBlock.use.case";
import { StringListToCompletionItems } from "./code/stringListToCompletionItems.use.case";
import { VariablesToCompletionItems } from "./code/variablesToCompletionItems.use.case";

export class CompletionItemProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems = (
        document: vscode.TextDocument,
        position: vscode.Position
    ) => {
        const completions = [];

        const entries = new GetEntriesCompletionList().execute(
            document,
            position
        );

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
        const reservedFunctions = new GetUnifaceProcFunctionList().execute();

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
                    reservedFunctions.map((proc) => proc.name),
                    vscode.CompletionItemKind.Method
                )
            );
        }

        return completions;
    };
}

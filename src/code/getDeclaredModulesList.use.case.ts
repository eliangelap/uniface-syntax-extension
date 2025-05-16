import * as vscode from "vscode";
import { DeclaredModule } from "./getVariablesFromBlock.use.case";

export class GetDeclaredModulesList {
    public execute(document: vscode.TextDocument): DeclaredModule[] {
        const text = document.getText().trim();
        const regex = /\b(entry|operation|function|trigger)\s+(\w+)/gi;

        const declaredModules = [];
        const functions: DeclaredModule[] = [];
        const operations: DeclaredModule[] = [];
        const entries: DeclaredModule[] = [];
        const triggers: DeclaredModule[] = [];

        const validKeywords = ["entry", "operation", "function", "trigger"];

        for (const match of text.matchAll(regex)) {
            const line = document.positionAt(match.index || 0).line;
            const lineText = document.lineAt(line).text.trim();

            if (
                !validKeywords.some((keyword) =>
                    lineText.toLowerCase().startsWith(keyword)
                )
            ) {
                continue;
            }

            const name = match[2];

            switch (match[1].toLowerCase()) {
                case "operation":
                    operations.push({
                        name,
                        line,
                        scriptModuleType: "operation",
                    });
                    break;
                case "trigger":
                    triggers.push({
                        name,
                        line,
                        scriptModuleType: "trigger",
                    });
                    break;
                case "function":
                    functions.push({
                        name,
                        line,
                        scriptModuleType: "function",
                    });
                    break;
                case "entry":
                default:
                    entries.push({ 
                        name, 
                        line, 
                        scriptModuleType: "entry" 
                    });
                    break;
            }
        }

        const sortFunction = function (a: DeclaredModule, b: DeclaredModule) {
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        };

        functions.sort(sortFunction);
        entries.sort(sortFunction);
        operations.sort(sortFunction);
        triggers.sort(sortFunction);

        declaredModules.push(...triggers);
        declaredModules.push(...operations);
        declaredModules.push(...entries);
        declaredModules.push(...functions);

        return declaredModules;
    }
}

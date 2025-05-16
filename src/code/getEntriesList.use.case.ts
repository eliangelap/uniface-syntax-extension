import * as vscode from "vscode";
import { DeclaredModule } from "./getVariablesFromBlock.use.case";
import { GetDeclaredModulesList } from './getDeclaredModulesList.use.case';

export class GetEntriesList {
    public execute(document: vscode.TextDocument): DeclaredModule[] {
        const modules = new GetDeclaredModulesList().execute(document);

        return modules.filter((declaredModule) => {
            return declaredModule.scriptModuleType === 'entry';
        });
    }
}

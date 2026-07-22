import * as vscode from 'vscode';
import { GetDeclaredModulesList } from './getDeclaredModulesList.use.case';
import { DeclaredModule } from './types/declaredModule';

export class GetEntriesList {
    public execute(document: vscode.TextDocument): DeclaredModule[] {
        const modules = new GetDeclaredModulesList().execute(document);

        return modules.filter((declaredModule) => {
            return declaredModule.scriptModuleType === 'entry';
        });
    }
}

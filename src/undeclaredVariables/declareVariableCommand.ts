import * as vscode from 'vscode';
import { variableTypes } from '../regExpConstants';
import { GetBlockAroundPosition } from '../code/getBlockAroundPosition.use.case';
import { GetParametersFromBlock } from '../code/getParametersFromBlock.use.case';
import { GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import { VariableDeclarationInserter } from './variableDeclarationInserter';

export class DeclareVariableCommand {
    public async execute(documentUri: vscode.Uri, name: string, usageLine: number): Promise<void> {
        const dataType = await vscode.window.showQuickPick(variableTypes, {
            placeHolder: `Select the type for "${name}"`,
        });
        if (!dataType) {
            return;
        }

        const document = await vscode.workspace.openTextDocument(documentUri);
        const block = new GetBlockAroundPosition().execute(
            document,
            new vscode.Position(usageLine, 0)
        );
        if (!block || this.isDeclared(block, name)) {
            return;
        }

        const insertion = new VariableDeclarationInserter().create(block, name, dataType);
        const edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, new vscode.Position(insertion.line, 0), insertion.text);
        await vscode.workspace.applyEdit(edit);
    }

    private isDeclared(block: ReturnType<GetBlockAroundPosition['execute']>, name: string): boolean {
        if (!block) {
            return false;
        }

        const declaredVariables = [
            ...new GetVariablesFromBlock().execute(block),
            ...new GetParametersFromBlock().execute(block),
        ];

        return declaredVariables.some((variable) => variable.name.toLowerCase() === name.toLowerCase());
    }
}

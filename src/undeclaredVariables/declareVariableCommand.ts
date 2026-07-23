import * as vscode from 'vscode';
import { variableTypes } from '../regExpConstants';
import { GetBlockAroundPosition } from '../code/getBlockAroundPosition.use.case';
import { GetParametersFromBlock } from '../code/getParametersFromBlock.use.case';
import { GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import { VariableDeclarationInserter } from './variableDeclarationInserter';

interface DeclareVariableCommandDependencies {
    selectDataType(name: string): Thenable<string | undefined>;
    openDocument(documentUri: vscode.Uri): Thenable<vscode.TextDocument>;
    getBlock(document: vscode.TextDocument, position: vscode.Position): ReturnType<GetBlockAroundPosition['execute']>;
    getVariables(block: NonNullable<ReturnType<GetBlockAroundPosition['execute']>>): ReturnType<
        GetVariablesFromBlock['execute']
    >;
    getParameters(block: NonNullable<ReturnType<GetBlockAroundPosition['execute']>>): ReturnType<
        GetParametersFromBlock['execute']
    >;
    createInsertion(
        block: NonNullable<ReturnType<GetBlockAroundPosition['execute']>>,
        name: string,
        dataType: string
    ): ReturnType<VariableDeclarationInserter['create']>;
    applyEdit(edit: vscode.WorkspaceEdit): Thenable<boolean>;
}

const defaultDependencies: DeclareVariableCommandDependencies = {
    selectDataType: (name) =>
        vscode.window.showQuickPick(variableTypes, {
            placeHolder: `Select the type for "${name}"`,
        }),
    openDocument: (documentUri) => vscode.workspace.openTextDocument(documentUri),
    getBlock: (document, position) => new GetBlockAroundPosition().execute(document, position),
    getVariables: (block) => new GetVariablesFromBlock().execute(block),
    getParameters: (block) => new GetParametersFromBlock().execute(block),
    createInsertion: (block, name, dataType) =>
        new VariableDeclarationInserter().create(block, name, dataType),
    applyEdit: (edit) => vscode.workspace.applyEdit(edit),
};

export class DeclareVariableCommand {
    constructor(private readonly dependencies: DeclareVariableCommandDependencies = defaultDependencies) {}

    public async execute(documentUri: vscode.Uri, name: string, usageLine: number): Promise<void> {
        const dataType = await this.dependencies.selectDataType(name);
        if (!dataType) {
            return;
        }

        const document = await this.dependencies.openDocument(documentUri);
        const block = this.dependencies.getBlock(document, new vscode.Position(usageLine, 0));
        if (!block || this.isDeclared(block, name)) {
            return;
        }

        const insertion = this.dependencies.createInsertion(block, name, dataType);
        const edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, new vscode.Position(insertion.line, 0), insertion.text);
        await this.dependencies.applyEdit(edit);
    }

    private isDeclared(block: ReturnType<GetBlockAroundPosition['execute']>, name: string): boolean {
        if (!block) {
            return false;
        }

        const declaredVariables = [
            ...this.dependencies.getVariables(block),
            ...this.dependencies.getParameters(block),
        ];

        return declaredVariables.some((variable) => variable.name.toLowerCase() === name.toLowerCase());
    }
}

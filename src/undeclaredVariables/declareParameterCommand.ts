import * as vscode from 'vscode';
import { GetBlockAroundPosition } from '../code/getBlockAroundPosition.use.case';
import { GetParametersFromBlock } from '../code/getParametersFromBlock.use.case';
import { GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import { variableTypes } from '../regExpConstants';
import { ParameterDeclarationInserter, ParameterDirection } from './parameterDeclarationInserter';

interface DeclareParameterCommandDependencies {
    selectDataType(name: string): Thenable<string | undefined>;
    selectDirection(name: string): Thenable<ParameterDirection | undefined>;
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
        dataType: string,
        direction: ParameterDirection
    ): ReturnType<ParameterDeclarationInserter['create']>;
    applyEdit(edit: vscode.WorkspaceEdit): Thenable<boolean>;
}

const parameterDirections: ParameterDirection[] = ['in', 'out', 'inout'];

const defaultDependencies: DeclareParameterCommandDependencies = {
    selectDataType: (name) =>
        vscode.window.showQuickPick(variableTypes, {
            placeHolder: `Select the type for "${name}"`,
        }),
    selectDirection: async (name) => {
        const direction = await vscode.window.showQuickPick(parameterDirections, {
            placeHolder: `Select the direction for "${name}"`,
        });

        return parameterDirections.find((option) => option === direction);
    },
    openDocument: (documentUri) => vscode.workspace.openTextDocument(documentUri),
    getBlock: (document, position) => new GetBlockAroundPosition().execute(document, position),
    getVariables: (block) => new GetVariablesFromBlock().execute(block),
    getParameters: (block) => new GetParametersFromBlock().execute(block),
    createInsertion: (block, name, dataType, direction) =>
        new ParameterDeclarationInserter().create(block, name, dataType, direction),
    applyEdit: (edit) => vscode.workspace.applyEdit(edit),
};

export class DeclareParameterCommand {
    constructor(private readonly dependencies: DeclareParameterCommandDependencies = defaultDependencies) {}

    public async execute(documentUri: vscode.Uri, name: string, usageLine: number): Promise<void> {
        const dataType = await this.dependencies.selectDataType(name);
        if (!dataType) {
            return;
        }

        const direction = await this.dependencies.selectDirection(name);
        if (!direction) {
            return;
        }

        const document = await this.dependencies.openDocument(documentUri);
        const block = this.dependencies.getBlock(document, new vscode.Position(usageLine, 0));
        if (!block || this.isDeclared(block, name)) {
            return;
        }

        const insertion = this.dependencies.createInsertion(block, name, dataType, direction);
        const edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, new vscode.Position(insertion.line, insertion.character), insertion.text);
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

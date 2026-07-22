import * as vscode from 'vscode';
import { GetFormattedDate } from '../util/getFormattedDate.use.case';
import { GetCurrentDate } from '../util/getCurrentDate.use.case';
import { OperationTemplateRenderer } from './renderers/operationTemplateRenderer';

interface OperationCreatorDependencies {
    getActiveTextEditor(): vscode.TextEditor | undefined;
    showInputBox(options: vscode.InputBoxOptions): Thenable<string | undefined>;
    showErrorMessage(message: string): Thenable<string | undefined>;
}

const defaultDependencies: OperationCreatorDependencies = {
    getActiveTextEditor: () => vscode.window.activeTextEditor,
    showInputBox: (options) => vscode.window.showInputBox(options),
    showErrorMessage: (message) => vscode.window.showErrorMessage(message),
};

export function isValidOperationName(operationName: string): boolean {
    return /^\w+$/.test(operationName);
}

export class OperationCreator {
    constructor(
        private readonly dependencies: OperationCreatorDependencies = defaultDependencies
    ) {}

    public async promptAndInsert(): Promise<void> {
        const inputName = await this.askOperationName();
        if (inputName === undefined) {
            return;
        }

        const operationName = inputName.trim();
        if (!isValidOperationName(operationName)) {
            await this.dependencies.showErrorMessage(
                'The operation name must contain only letters, numbers, or underscores.'
            );
            return;
        }

        const editor = this.dependencies.getActiveTextEditor();
        if (!editor || editor.document.languageId !== 'uniface') {
            await this.dependencies.showErrorMessage(
                'Open a Uniface document to insert an operation.'
            );
            return;
        }

        const snippet = this.buildOperationSnippet(operationName);
        const wasInserted = await editor.insertSnippet(snippet);

        if (!wasInserted) {
            await this.dependencies.showErrorMessage('Unable to insert the operation.');
        }
    }

    private async askOperationName(): Promise<string | undefined> {
        return this.dependencies.showInputBox({
            title: 'Operation name',
            value: 'operation_1',
            prompt: `Enter operation's name...`,
        });
    }

    private buildOperationSnippet(operationName: string): vscode.SnippetString {
        const author = process.env.USERNAME ?? 'unknown';
        const currentDate = new GetCurrentDate().execute();
        const date = new GetFormattedDate().execute(currentDate);

        return new OperationTemplateRenderer().render({ operationName, author, date });
    }
}

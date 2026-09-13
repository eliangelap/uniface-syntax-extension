import * as vscode from 'vscode';
import { GetCurrentDate } from '../util/getCurrentDate.use.case';
import { GetFormattedDate } from '../util/getFormattedDate.use.case';
import { EntryTemplateRenderer } from './renderers/entryTemplateRenderer';

interface EntryCreatorDependencies {
    getActiveTextEditor(): vscode.TextEditor | undefined;
    showInputBox(options: vscode.InputBoxOptions): Thenable<string | undefined>;
    showErrorMessage(message: string): Thenable<string | undefined>;
}

const defaultDependencies: EntryCreatorDependencies = {
    getActiveTextEditor: () => vscode.window.activeTextEditor,
    showInputBox: (options) => vscode.window.showInputBox(options),
    showErrorMessage: (message) => vscode.window.showErrorMessage(message),
};

export function isValidEntryName(entryName: string): boolean {
    return /^\w+$/.test(entryName);
}

export class EntryCreator {
    constructor(private readonly dependencies: EntryCreatorDependencies = defaultDependencies) {}

    public async promptAndInsert(): Promise<void> {
        const inputName = await this.askEntryName();
        if (inputName === undefined) {
            return;
        }

        const entryName = inputName.trim();
        if (!isValidEntryName(entryName)) {
            await this.dependencies.showErrorMessage(
                'The entry name must contain only letters, numbers, or underscores.'
            );
            return;
        }

        const editor = this.dependencies.getActiveTextEditor();
        if (editor?.document.languageId !== 'uniface') {
            await this.dependencies.showErrorMessage('Open a Uniface document to insert an entry.');
            return;
        }

        const snippet = this.buildEntrySnippet(entryName);
        const wasInserted = await editor.insertSnippet(snippet);

        if (!wasInserted) {
            await this.dependencies.showErrorMessage('Unable to insert the entry.');
        }
    }

    private async askEntryName(): Promise<string | undefined> {
        return this.dependencies.showInputBox({
            title: 'Entry name',
            value: 'entry_1',
            prompt: `Enter entry's name...`,
        });
    }

    private buildEntrySnippet(entryName: string): vscode.SnippetString {
        const author = process.env.USERNAME ?? 'unknown';
        const currentDate = new GetCurrentDate().execute();
        const date = new GetFormattedDate().execute(currentDate);

        return new EntryTemplateRenderer().render({ entryName, author, date });
    }
}

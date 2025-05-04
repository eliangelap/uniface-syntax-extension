import * as vscode from 'vscode';
import { GetCurrentDate } from '../util/getCurrentData.use.case';
import { GetFormattedDate } from '../util/getFormattedDate.use.case';

export class EntryCreator {
    private readonly editor: vscode.TextEditor | undefined;

    constructor() {
        this.editor = vscode.window.activeTextEditor;
    }

    public async promptAndInsert(): Promise<void> {
        const entryName = await this.askEntryName();
        if (!entryName || !this.editor) {
            return;
        }

        const snippet = this.buildEntrySnippet(entryName);
        this.editor.insertSnippet(snippet);
    }

    private async askEntryName(): Promise<string | undefined> {
        return vscode.window.showInputBox({
            title: 'Entry name',
            value: 'entry_1',
            prompt: `Enter entry's name...`,
        });
    }

    private buildEntrySnippet(entryName: string): vscode.SnippetString {
        const author = process.env.USERNAME ?? 'unknown';
        const currentDate = new GetCurrentDate().execute();
        const date = new GetFormattedDate().execute(currentDate);

        const entryCode = [
            ';|',
            `; Autor: ${author}`,
            `; Data: ${date}`,
            '; Função: ',
            ';',
            `entry ${entryName}`,
            '    params',
            '        string  pLsEntrada   : in',
            '        string  pLsSaida     : out',
            '                \\$t_ds_erro\\$  : out',
            '    endparams',
            '    variables',
            '        string  vDsContexto',
            '    endvariables',
            '',
            `    vDsContexto = "%%^<\\$componentname>, <\\$trigger>, ${entryName}"`,
            '',
            '    ; Enter your code here...',
            '',
            '    return 0',
            `end ;${entryName}`,
        ].join('\n');

        return new vscode.SnippetString(entryCode);
    }
}

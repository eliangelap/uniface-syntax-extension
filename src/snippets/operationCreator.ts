import * as vscode from 'vscode';
import { GetFormattedDate } from '../util/getFormattedDate.use.case';
import { GetCurrentDate } from '../util/getCurrentData.use.case';

export class OperationCreator {
    private readonly editor: vscode.TextEditor | undefined;

    constructor() {
        this.editor = vscode.window.activeTextEditor;
    }

    public async promptAndInsert(): Promise<void> {
        const operationName = await this.askOperationName();
        if (!operationName || !this.editor) {
            return;
        }

        const snippet = this.buildOperationSnippet(operationName);
        this.editor.insertSnippet(snippet);
    }

    private async askOperationName(): Promise<string | undefined> {
        return vscode.window.showInputBox({
            title: 'Operation name',
            value: 'operation_1',
            prompt: `Enter operation's name...`,
        });
    }

    private buildOperationSnippet(operationName: string): vscode.SnippetString {
        const author = process.env.USERNAME ?? 'unknown';
        const currentDate = new GetCurrentDate().execute();
        const date = new GetFormattedDate().execute(currentDate);

        const operationCode = [
            ';|',
            `; Autor: ${author}`,
            `; Data: ${date}`,
            '; Função: ',
            ';',
            `operation ${operationName}`,
            '    params',
            '        string  pLsEntrada   : in',
            '        string  pLsSaida     : out',
            '                \\$t_ds_erro\\$  : out',
            '    endparams',
            '    variables',
            '        string  vDsContexto',
            '    endvariables',
            '',
            `    vDsContexto = "%%^<\\$componentname>, <\\$trigger>, ${operationName}"`,
            '',
            '    ; Enter your code here...',
            '',
            '    return 0',
            `end ;${operationName}`,
        ].join('\n');

        return new vscode.SnippetString(operationCode);
    }
}

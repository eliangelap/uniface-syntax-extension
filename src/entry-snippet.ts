import * as vscode from 'vscode';

export function createEntrySnippet() {
    vscode.window
        .showInputBox({
            title: 'Entry name',
            value: 'entry_1',
            prompt: 'Enter the entry name...',
        })
        .then((value) => {
            if (!value) {
                return;
            }

            vscode.window.activeTextEditor?.insertSnippet(
                new vscode.SnippetString(getEntryText(value))
            );
        });
}

function getEntryText(entryName: string) {
    return `
;|
; Autor: 
; Data: 
; Função: 
;
entry ${entryName}
    params
        string  pLsEntrada   : in
        string  pLsSaida     : out
                \\$t_ds_erro\\$  : out
    endparams
    variables
        string  vDsContexto
    endvariables

    vDsContexto = "%%^<\\$componentname>, <\\$trigger>, ${entryName}"

    ; Enter your code here...

    return 0
end ;${entryName}`;
}

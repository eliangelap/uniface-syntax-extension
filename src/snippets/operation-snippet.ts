import * as vscode from 'vscode';
import { getFormattedCurrentDate } from '../util';

export function createOperationSnippet() {
    vscode.window
        .showInputBox({
            title: 'Operation name',
            value: 'operation_1',
            prompt: `Enter operation's name...`,
        })
        .then((value) => {
            if (!value) {
                return;
            }

            vscode.window.activeTextEditor?.insertSnippet(
                new vscode.SnippetString(getOperationText(value))
            );
        });
}

function getOperationText(operationName: string) {
    return `
;|
; Autor: ${process.env.USERNAME}
; Data: ${getFormattedCurrentDate()}
; Função: 
;
operation ${operationName}
    params
        string  pLsEntrada   : in
        string  pLsSaida     : out
                \\$t_ds_erro\\$  : out
    endparams
    variables
        string  vDsContexto
    endvariables

    vDsContexto = "%%^<\\$componentname>, <\\$trigger>, ${operationName}"

    ; Enter your code here...

    return 0
end ;${operationName}`;
}

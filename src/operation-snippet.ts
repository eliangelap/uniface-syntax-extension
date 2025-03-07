import * as vscode from 'vscode';

export function createOperationSnippet() {
    vscode.window
        .showInputBox({
            title: 'Operation name',
            value: 'operation_1',
            prompt: 'Enter the name of the operation',
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
; Autor: 
; Data: 
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

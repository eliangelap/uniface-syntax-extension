import * as vscode from 'vscode';

export interface OperationTemplateData {
    operationName: string;
    author: string;
    date: string;
}

const defaultOperationTemplate = `;|
; Author: {{author}}
; Date: {{date}}
; Description: 
;
operation {{operationName}}
    params
        string  pLsEntrada   : in
        string  pLsSaida     : out
                \\$t_ds_erro\\$  : out
    endparams
    variables
        string  vDsContexto
    endvariables

    vDsContexto = "%%^<\\$componentname>, <\\$trigger>, {{operationName}}"

    ; Enter your code here...

    return 0
end ;{{operationName}}`;

type OperationTemplateReader = () => unknown;

function getConfiguredOperationTemplate(): unknown {
    return vscode.workspace.getConfiguration('uniface').get('snippets.operationTemplate');
}

function getOperationTemplate(template: unknown): string {
    if (typeof template === 'string' && template.trim().length > 0) {
        return template;
    }

    if (
        Array.isArray(template) &&
        template.length > 0 &&
        template.every((line) => typeof line === 'string')
    ) {
        return template.join('\n');
    }

    return defaultOperationTemplate;
}

function escapeSnippetValue(value: string): string {
    return value.replace(/[$}\\]/g, '\\$&');
}

export class OperationTemplateRenderer {
    constructor(
        private readonly readTemplate: OperationTemplateReader = getConfiguredOperationTemplate
    ) {}

    public render(data: OperationTemplateData): vscode.SnippetString {
        const configuredTemplate = this.readTemplate();
        const template = getOperationTemplate(configuredTemplate);
        const values: Record<keyof OperationTemplateData, string> = {
            operationName: escapeSnippetValue(data.operationName),
            author: escapeSnippetValue(data.author),
            date: escapeSnippetValue(data.date),
        };
        const text = template.replace(
            /\{\{(operationName|author|date)\}\}/g,
            (_, placeholder: keyof OperationTemplateData) => values[placeholder]
        );

        return new vscode.SnippetString(text);
    }
}

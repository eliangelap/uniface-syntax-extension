import * as vscode from 'vscode';

export interface EntryTemplateData {
    entryName: string;
    author: string;
    date: string;
}

const defaultEntryTemplate = String.raw`;|
; Author: {{author}}
; Date: {{date}}
; Description: 
;
entry {{entryName}}
    params
        string  pLsEntrada   : in
        string  pLsSaida     : out
                \$t_ds_erro\$  : out
    endparams
    variables
        string  vDsContexto
    endvariables

    vDsContexto = "%%^<\$componentname>, <\$trigger>, {{entryName}}"

    ; Enter your code here...

    return 0
end ;{{entryName}}`;

type EntryTemplateReader = () => unknown;

function getConfiguredEntryTemplate(): unknown {
    return vscode.workspace.getConfiguration('uniface').get('snippets.entryTemplate');
}

function getEntryTemplate(template: unknown): string {
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

    return defaultEntryTemplate;
}

function escapeSnippetValue(value: string): string {
    return value.replace(/[$}\\]/g, String.raw`\$&`);
}

export class EntryTemplateRenderer {
    constructor(private readonly readTemplate: EntryTemplateReader = getConfiguredEntryTemplate) {}

    public render(data: EntryTemplateData): vscode.SnippetString {
        const configuredTemplate = this.readTemplate();
        const template = getEntryTemplate(configuredTemplate);
        const values: Record<keyof EntryTemplateData, string> = {
            entryName: escapeSnippetValue(data.entryName),
            author: escapeSnippetValue(data.author),
            date: escapeSnippetValue(data.date),
        };
        const text = template.replace(
            /\{\{(entryName|author|date)\}\}/g,
            (_, placeholder: keyof EntryTemplateData) => {
                return values[placeholder];
            }
        );

        return new vscode.SnippetString(text);
    }
}

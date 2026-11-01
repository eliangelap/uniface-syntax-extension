import * as vscode from 'vscode';

const BUILT_IN_SNIPPET_IDS = ['wlent', 'retv', 'stor'];

export class GetSnippetDefinitions {
    public execute(
        configuration: Pick<vscode.WorkspaceConfiguration, 'get'>
    ): Record<string, unknown> {
        const definitions: Record<string, unknown> = {};

        for (const id of BUILT_IN_SNIPPET_IDS) {
            definitions[id] = {
                prefix: configuration.get(`snippets.${id}.prefix`),
                body: configuration.get(`snippets.${id}.body`),
            };
        }

        const custom = configuration.get('snippets.custom');

        if (typeof custom === 'object' && custom !== null) {
            Object.assign(definitions, custom);
        }

        return definitions;
    }
}

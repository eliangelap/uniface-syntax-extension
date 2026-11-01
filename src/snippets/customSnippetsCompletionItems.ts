import * as vscode from 'vscode';

export interface CustomSnippetDefinition {
    prefix?: unknown;
    body?: unknown;
    description?: unknown;
}

export class CustomSnippetsCompletionItems {
    public execute(definitions: unknown): vscode.CompletionItem[] {
        if (typeof definitions !== 'object' || definitions === null) {
            return [];
        }

        const items: vscode.CompletionItem[] = [];

        for (const [name, definition] of Object.entries(definitions)) {
            const item = this.toCompletionItem(name, definition as CustomSnippetDefinition | null);

            if (item) {
                items.push(item);
            }
        }

        return items;
    }

    private toCompletionItem(
        name: string,
        definition: CustomSnippetDefinition | null
    ): vscode.CompletionItem | undefined {
        const prefix = typeof definition?.prefix === 'string' ? definition.prefix.trim() : '';
        const body = this.normalizeBody(definition?.body);

        if (!prefix || body === undefined) {
            return undefined;
        }

        const item = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Snippet);
        item.insertText = new vscode.SnippetString(body);
        item.detail = name;
        item.documentation =
            typeof definition?.description === 'string'
                ? definition.description
                : new vscode.MarkdownString().appendCodeblock(body);

        return item;
    }

    private normalizeBody(body: unknown): string | undefined {
        if (typeof body === 'string') {
            return body;
        }

        if (Array.isArray(body) && body.every((line) => typeof line === 'string')) {
            return body.join('\n');
        }

        return undefined;
    }
}

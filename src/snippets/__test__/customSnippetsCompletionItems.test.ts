import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { CustomSnippetsCompletionItems } from '../customSnippetsCompletionItems';

suite('CustomSnippetsCompletionItems', () => {
    test('creates snippet completion from prefix and body lines', () => {
        const items = new CustomSnippetsCompletionItems().execute({
            'validate-store-error': {
                prefix: 'stor',
                body: ['store/e "${1:entidade}"', 'if(\\$status < 0)', '\treturn <g_erroexec>'],
            },
        });

        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0].label, 'stor');
        assert.strictEqual(items[0].kind, vscode.CompletionItemKind.Snippet);
        assert.strictEqual(items[0].detail, 'validate-store-error');
        assert.strictEqual(
            (items[0].insertText as vscode.SnippetString).value,
            'store/e "${1:entidade}"\nif(\\$status < 0)\n\treturn <g_erroexec>'
        );
    });

    test('accepts a string body and a description', () => {
        const items = new CustomSnippetsCompletionItems().execute({
            a: { prefix: 'x', body: 'one\ntwo', description: 'desc' },
        });

        assert.strictEqual((items[0].insertText as vscode.SnippetString).value, 'one\ntwo');
        assert.strictEqual(items[0].documentation, 'desc');
    });

    test('ignores invalid definitions', () => {
        const provider = new CustomSnippetsCompletionItems();

        assert.deepStrictEqual(provider.execute(undefined), []);
        assert.deepStrictEqual(provider.execute('x'), []);
        assert.deepStrictEqual(
            provider.execute({
                noPrefix: { body: ['a'] },
                emptyPrefix: { prefix: ' ', body: ['a'] },
                noBody: { prefix: 'p' },
                badBody: { prefix: 'p', body: [1] },
                nullDef: null,
            }),
            []
        );
    });
});

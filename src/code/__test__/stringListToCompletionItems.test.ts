import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { StringListToCompletionItems } from '../stringListToCompletionItems.use.case';

suite('StringListToCompletionItems', () => {
    test('preserves dollar prefixes and removes duplicate items', () => {
        const completions = new StringListToCompletionItems().execute(
            ['$about', '$ABOUT', 'call'],
            vscode.CompletionItemKind.Method
        );

        assert.strictEqual(completions.length, 2);
        assert.strictEqual(completions[0].label, '$about');
        assert.strictEqual(completions[0].insertText, '$about');
        assert.strictEqual(completions[1].label, 'call');
    });
});

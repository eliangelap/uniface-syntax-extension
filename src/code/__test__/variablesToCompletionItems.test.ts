import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { VariablesToCompletionItems } from '../variablesToCompletionItems.use.case';

suite('VariablesToCompletionItems', () => {
    test('preserves dollar prefixes, ranges, and unique variable names', () => {
        const range = new vscode.Range(1, 4, 1, 7);
        const completions = new VariablesToCompletionItems().execute(
            [
                { dataType: 'string', name: '$error', line: 1 },
                { dataType: 'numeric', name: '$ERROR', line: 2 },
                { dataType: 'string', name: 'variableName', line: 3 },
            ],
            range
        );

        assert.strictEqual(completions.length, 2);
        assert.strictEqual(completions[0].insertText, '$error');
        assert.deepStrictEqual(completions[0].range, range);
        assert.strictEqual(completions[1].insertText, 'variableName');
        assert.strictEqual(completions[1].range, undefined);
    });
});

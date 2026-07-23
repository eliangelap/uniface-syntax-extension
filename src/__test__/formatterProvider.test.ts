import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { formatterProvider } from '../formatterProvider';

const cancellationToken = {
    isCancellationRequested: false,
    onCancellationRequested: () => ({ dispose: () => undefined }),
} as vscode.CancellationToken;

suite('UnifaceFormatterProvider', () => {
    test('does not format documents with a missing block END', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry incomplete\n    value = 1',
            language: 'uniface',
        });

        const edits = await formatterProvider().provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            cancellationToken
        );

        assert.deepStrictEqual(edits, []);
    });

    test('formats documents with closed blocks', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry valid\nvalue = 1\nend',
            language: 'uniface',
        });

        const edits = await formatterProvider().provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            cancellationToken
        );

        assert.strictEqual(edits?.length, 1);
    });
});

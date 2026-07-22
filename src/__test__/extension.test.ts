import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { runPromptAndInsert, shouldAnalyzeDocument } from '../extension';

suite('Extension', () => {
    test('returns the promise from command creators', async () => {
        let wasCalled = false;
        const promise = runPromptAndInsert({
            promptAndInsert: async () => {
                wasCalled = true;
            },
        });

        await promise;

        assert.strictEqual(wasCalled, true);
    });

    test('analyzes only the active Uniface document', async () => {
        const unifaceDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'uniface',
        });
        const otherUnifaceDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'uniface',
        });
        const plainTextDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'plaintext',
        });
        const editor = { document: unifaceDocument } as vscode.TextEditor;

        assert.strictEqual(shouldAnalyzeDocument(editor, unifaceDocument), true);
        assert.strictEqual(shouldAnalyzeDocument(editor, otherUnifaceDocument), false);
        assert.strictEqual(shouldAnalyzeDocument(editor, plainTextDocument), false);
    });
});

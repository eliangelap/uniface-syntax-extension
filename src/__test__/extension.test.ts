import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { analyzeOpenUnifaceDocuments, runPromptAndInsert, shouldAnalyzeDocument } from '../extension';

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

    test('identifies Uniface documents for analysis', async () => {
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
        assert.strictEqual(shouldAnalyzeDocument(unifaceDocument), true);
        assert.strictEqual(shouldAnalyzeDocument(otherUnifaceDocument), true);
        assert.strictEqual(shouldAnalyzeDocument(plainTextDocument), false);
    });

    test('analyzes Uniface documents that were already open on activation', async () => {
        const unifaceDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'uniface',
        });
        const plainTextDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'plaintext',
        });
        const analyzedDocuments: vscode.TextDocument[] = [];

        analyzeOpenUnifaceDocuments([unifaceDocument, plainTextDocument], [
            { analyzeDocument: (document) => analyzedDocuments.push(document) },
        ]);

        assert.deepStrictEqual(analyzedDocuments, [unifaceDocument]);
    });
});

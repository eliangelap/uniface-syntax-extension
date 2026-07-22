import * as assert from 'node:assert';
import * as vscode from 'vscode';
import {
    getGoldCharacterRanges,
    isUnifaceDocument,
    registerGoldDecorationEvents,
} from '../goldDecorator';

suite('GoldDecorator', () => {
    test('groups GOLD characters in one pass by ASCII code', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: `a\x1Bb\x12\x1B`,
            language: 'uniface',
        });

        const ranges = getGoldCharacterRanges(document, [27, 18]);

        assert.deepStrictEqual(
            ranges.get(27)?.map((decoration) => decoration.range.start.character),
            [1, 4]
        );
        assert.deepStrictEqual(
            ranges.get(18)?.map((decoration) => decoration.range.start.character),
            [3]
        );
    });

    test('identifies only Uniface documents as decoration targets', async () => {
        const unifaceDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'uniface',
        });
        const plainTextDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'plaintext',
        });

        assert.strictEqual(isUnifaceDocument(unifaceDocument), true);
        assert.strictEqual(isUnifaceDocument(plainTextDocument), false);
    });

    test('registers decoration types for automatic disposal', () => {
        const context = { subscriptions: [] as vscode.Disposable[] } as vscode.ExtensionContext;

        registerGoldDecorationEvents(context);

        assert.ok(context.subscriptions.length >= 12);
        for (const disposable of context.subscriptions) {
            disposable.dispose();
        }
    });
});

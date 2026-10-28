import * as assert from 'node:assert';
import * as vscode from 'vscode';
import {
    createGoldDecorationOptions,
    getGoldCharacterRanges,
    isUnifaceDocument,
    registerGoldDecorationEvents,
} from '../goldDecorator';

suite('GoldDecorator', () => {
    test('hides the original GOLD character while displaying its marker', () => {
        const options = createGoldDecorationOptions(';');

        assert.strictEqual(options.textDecoration, 'none; display: none;');
        assert.strictEqual(options.before?.contentText, ';');
    });

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

    test('updates decorations after editing the active Uniface document', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'value',
            language: 'uniface',
        });
        const editor = await vscode.window.showTextDocument(document);
        const context = { subscriptions: [] as vscode.Disposable[] } as vscode.ExtensionContext;
        registerGoldDecorationEvents(context);

        await editor.edit((editBuilder) => {
            editBuilder.insert(new vscode.Position(0, 5), '\x1B');
        });
        await new Promise((resolve) => setTimeout(resolve, 300));

        assert.strictEqual(document.getText(), 'value\x1B');
        for (const disposable of context.subscriptions) {
            disposable.dispose();
        }
    });
});

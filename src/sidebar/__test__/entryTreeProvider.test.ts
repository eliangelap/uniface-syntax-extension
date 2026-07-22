import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { registerTreeDataProvider } from '../entryTreeProvider';

suite('EntryTreeProvider', () => {
    test('registers the tree resources for disposal', () => {
        const context = { subscriptions: [] as vscode.Disposable[] } as vscode.ExtensionContext;

        registerTreeDataProvider(context, 'uniface-test.navigateToFunction');

        assert.ok(context.subscriptions.length >= 5);
        for (const disposable of context.subscriptions) {
            disposable.dispose();
        }
    });
});

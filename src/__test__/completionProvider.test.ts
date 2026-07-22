import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { CompletionItemProvider } from '../completionProvider';

suite('CompletionItemProvider', () => {
    test('lists statements in a code block', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry sampleEntry\n\nend\n',
            language: 'uniface',
        });

        const completions = new CompletionItemProvider().provideCompletionItems(
            document,
            new vscode.Position(1, 0)
        ) as vscode.CompletionItem[];

        const callCompletion = completions.find((completion) => completion.label === 'call');

        assert.ok(callCompletion);
        assert.strictEqual(callCompletion.kind, vscode.CompletionItemKind.Keyword);
    });

    test('does not list completions in a comment', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry sampleEntry\n; comment\nend\n',
            language: 'uniface',
        });

        const completions = new CompletionItemProvider().provideCompletionItems(
            document,
            new vscode.Position(1, 0)
        );

        assert.deepStrictEqual(completions, []);
    });

    test('prioritizes entries over statements for call commands', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry targetEntry\nend\nentry callerEntry\ncall \nend\n',
            language: 'uniface',
        });

        const completions = new CompletionItemProvider().provideCompletionItems(
            document,
            new vscode.Position(3, 5)
        ) as vscode.CompletionItem[];

        assert.ok(completions.length > 0);
        assert.ok(
            completions.every((completion) => completion.kind === vscode.CompletionItemKind.Method)
        );
    });
});

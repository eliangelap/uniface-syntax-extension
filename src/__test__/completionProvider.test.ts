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

    test('replaces the current proc function token with its dollar prefix', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry sampleEntry\n    $ab\nend\n',
            language: 'uniface',
        });
        const position = new vscode.Position(1, 7);

        const completions = new CompletionItemProvider().provideCompletionItems(
            document,
            position
        ) as vscode.CompletionItem[];
        const aboutCompletion = completions.find((completion) => completion.label === '$about');

        assert.ok(aboutCompletion);
        assert.strictEqual(aboutCompletion.insertText, '$about');
        assert.deepStrictEqual(aboutCompletion.range, new vscode.Range(1, 4, 1, 7));
    });

    test('does not list proc functions outside their cursor context', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry sampleEntry\nvalue = \nend\n',
            language: 'uniface',
        });

        const completions = new CompletionItemProvider().provideCompletionItems(
            document,
            new vscode.Position(1, 8)
        ) as vscode.CompletionItem[];

        assert.ok(
            completions.every((completion) => completion.kind !== vscode.CompletionItemKind.Method)
        );
    });

    test('does not duplicate parameter and variable suggestions with the same name', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: [
                'entry sampleEntry',
                'params',
                'string sharedName : in',
                'endparams',
                'variables',
                'numeric sharedName',
                'endvariables',
                '',
                'end',
            ].join('\n'),
            language: 'uniface',
        });

        const completions = new CompletionItemProvider().provideCompletionItems(
            document,
            new vscode.Position(7, 0)
        ) as vscode.CompletionItem[];
        const sharedNameCompletions = completions.filter(
            (completion) => completion.insertText === 'sharedName'
        );

        assert.strictEqual(sharedNameCompletions.length, 1);
    });
});

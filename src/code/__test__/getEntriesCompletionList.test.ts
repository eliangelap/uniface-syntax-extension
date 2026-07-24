import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { GetEntriesCompletionList } from '../getEntriesCompletionList.use.case';

suite('GetEntriesCompletionList', () => {
    test('lists entries for the call command regardless of casing', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry targetEntry\nend\n    CALL \n',
            language: 'uniface',
        });

        const completions = new GetEntriesCompletionList().execute(
            document,
            new vscode.Position(2, 9)
        );

        assert.deepStrictEqual(
            completions.map((completion) => completion.label),
            ['targetEntry']
        );
        assert.strictEqual(completions[0].kind, vscode.CompletionItemKind.Method);
    });

    test('lists entries for inline call commands up to the cursor', async () => {
        const inlineCall = 'if (condition) CALL target';
        const document = await vscode.workspace.openTextDocument({
            content: `entry targetEntry\nend\nentry otherEntry\nend\n${inlineCall}\n`,
            language: 'uniface',
        });

        const completions = new GetEntriesCompletionList().execute(
            document,
            new vscode.Position(4, inlineCall.length)
        );

        assert.deepStrictEqual(
            completions.map((completion) => completion.label),
            ['otherEntry', 'targetEntry']
        );
    });

    test('does not list entries for a command prefix', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry targetEntry\nend\ncallback targetEntry\n',
            language: 'uniface',
        });

        const completions = new GetEntriesCompletionList().execute(
            document,
            new vscode.Position(2, 0)
        );

        assert.deepStrictEqual(completions, []);
    });
});

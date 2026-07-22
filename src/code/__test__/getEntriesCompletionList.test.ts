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
            new vscode.Position(2, 8)
        );

        assert.deepStrictEqual(
            completions.map((completion) => completion.label),
            ['targetEntry']
        );
        assert.strictEqual(completions[0].kind, vscode.CompletionItemKind.Method);
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

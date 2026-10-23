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

    test('matches entries case-insensitively and replaces the typed call prefix', async () => {
        const document = await vscode.workspace.openTextDocument({
            content:
                'entry PL_CORRIGE_CEP\nend\nentry plGetCoordenadas\nend\ncall pl\ncall PL\n',
            language: 'uniface',
        });
        const completionList = new GetEntriesCompletionList();

        for (const position of [new vscode.Position(4, 7), new vscode.Position(5, 7)]) {
            const completions = completionList.execute(document, position);

            assert.deepStrictEqual(
                completions.map((completion) => completion.label),
                ['PL_CORRIGE_CEP', 'plGetCoordenadas']
            );
            assert.deepStrictEqual(
                completions.map((completion) => completion.insertText),
                ['PL_CORRIGE_CEP', 'plGetCoordenadas']
            );
            assert.ok(
                completions.every((completion) => completion.filterText === completion.label.toString().toLowerCase())
            );
            assert.ok(
                completions.every(
                    (completion) =>
                        completion.range instanceof vscode.Range &&
                        completion.range.isEqual(
                            new vscode.Range(position.line, 5, position.line, 7)
                        )
                )
            );
        }
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

    test('does not list entries for calls in strings or comments', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry targetEntry\nend\nmessage "call target"\n; call target\n',
            language: 'uniface',
        });

        const completionList = new GetEntriesCompletionList();

        assert.deepStrictEqual(
            completionList.execute(document, new vscode.Position(2, 19)),
            []
        );
        assert.deepStrictEqual(
            completionList.execute(document, new vscode.Position(3, 13)),
            []
        );
    });
});

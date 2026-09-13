import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { GetBlockList } from '../getBlockList.use.case';

suite('GetBlockList', () => {
    test('lists consecutive blocks', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry firstEntry\nend\noperation secondOperation\nend\n',
            language: 'uniface',
        });

        const blocks = new GetBlockList().execute(document);

        assert.deepStrictEqual(blocks, [
            {
                text: 'entry firstEntry\nend',
                startLine: 0,
                lines: ['entry firstEntry', 'end'],
            },
            {
                text: 'operation secondOperation\nend',
                startLine: 2,
                lines: ['operation secondOperation', 'end'],
            },
        ]);
    });
});

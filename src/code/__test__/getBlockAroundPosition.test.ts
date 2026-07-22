import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { GetBlockAroundPostion } from '../getBlockAroundPosition.use.case';

suite('GetBlockAroundPostion', () => {
    test('finds a valid module block from an internal position', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry validEntry\nvariables\nstring value\nendvariables\nend\n',
            language: 'uniface',
        });

        const block = new GetBlockAroundPostion().execute(document, new vscode.Position(2, 0));

        assert.deepStrictEqual(block, {
            text: 'entry validEntry\nvariables\nstring value\nendvariables\nend',
            startLine: 0,
            lines: ['entry validEntry', 'variables', 'string value', 'endvariables', 'end'],
        });
    });

    test('does not treat a non-declaration line as a block start', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'operation = value\n',
            language: 'uniface',
        });

        const block = new GetBlockAroundPostion().execute(document, new vscode.Position(0, 0));

        assert.strictEqual(block, null);
    });

    test('returns null when the position is outside a block', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry validEntry\nend\n\n',
            language: 'uniface',
        });

        const block = new GetBlockAroundPostion().execute(document, new vscode.Position(2, 0));

        assert.strictEqual(block, null);
    });

    test('returns null when the position is on the closing end', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry validEntry\nend\n',
            language: 'uniface',
        });

        const block = new GetBlockAroundPostion().execute(document, new vscode.Position(1, 0));

        assert.strictEqual(block, null);
    });
});

import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { GetBlockAroundPosition } from '../getBlockAroundPosition.use.case';

suite('GetBlockAroundPosition', () => {
    test('finds a valid module block from an internal position', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry validEntry\nvariables\nstring value\nendvariables\nend\n',
            language: 'uniface',
        });

        const block = new GetBlockAroundPosition().execute(document, new vscode.Position(2, 0));

        assert.deepStrictEqual(block, {
            text: 'entry validEntry\nvariables\nstring value\nendvariables\nend',
            startLine: 0,
            lines: ['entry validEntry', 'variables', 'string value', 'endvariables', 'end'],
        });
    });

    test('ends an incomplete block before the next module declaration', async () => {
        for (const nextModule of ['entry nextEntry', 'operation nextOperation', 'function nextFunction', 'trigger nextTrigger']) {
            const document = await vscode.workspace.openTextDocument({
                content: `entry incompleteEntry\nvariables\nstring currentValue\nendvariables\n${nextModule}\n`,
                language: 'uniface',
            });

            const block = new GetBlockAroundPosition().execute(document, new vscode.Position(2, 0));

            assert.deepStrictEqual(block?.lines, [
                'entry incompleteEntry',
                'variables',
                'string currentValue',
                'endvariables',
            ]);
        }
    });

    test('uses the document end for an incomplete final block', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry incompleteEntry\nvariables\nstring currentValue\nendvariables\ncurrentValue = 1\n',
            language: 'uniface',
        });

        const block = new GetBlockAroundPosition().execute(document, new vscode.Position(4, 0));

        assert.deepStrictEqual(block?.lines, [
            'entry incompleteEntry',
            'variables',
            'string currentValue',
            'endvariables',
            'currentValue = 1',
            '',
        ]);
    });

    test('does not treat a non-declaration line as a block start', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'operation = value\n',
            language: 'uniface',
        });

        const block = new GetBlockAroundPosition().execute(document, new vscode.Position(0, 0));

        assert.strictEqual(block, null);
    });

    test('returns null when the position is outside a block', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry validEntry\nend\n\n',
            language: 'uniface',
        });

        const block = new GetBlockAroundPosition().execute(document, new vscode.Position(2, 0));

        assert.strictEqual(block, null);
    });

    test('returns null when the position is on the closing end', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry validEntry\nend\n',
            language: 'uniface',
        });

        const block = new GetBlockAroundPosition().execute(document, new vscode.Position(1, 0));

        assert.strictEqual(block, null);
    });
});

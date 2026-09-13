import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { GetEntriesList } from '../getEntriesList.use.case';

suite('GetEntriesList', () => {
    test('returns only entries ordered by name', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: [
                'operation ignoredOperation',
                'entry zebraEntry',
                'function ignoredFunction',
                'entry alphaEntry',
            ].join('\n'),
            language: 'uniface',
        });

        const entries = new GetEntriesList().execute(document);

        assert.deepStrictEqual(entries, [
            {
                name: 'alphaEntry',
                line: 3,
                scriptModuleType: 'entry',
            },
            {
                name: 'zebraEntry',
                line: 1,
                scriptModuleType: 'entry',
            },
        ]);
    });
});

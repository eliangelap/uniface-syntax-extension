import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { DocumentAnalysisSnapshotBuilder } from '../documentAnalysisSnapshot';

suite('DocumentAnalysisSnapshotBuilder', () => {
    test('builds blocks, declarations, modules, and structure diagnostics in one snapshot', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'uniface',
            content: [
                '; entry ignored',
                'operation beta',
                'params',
                'string input : in',
                'endparams',
                'variables',
                'numeric value',
                'endvariables',
                'end',
                'entry alpha',
                'end',
            ].join('\n'),
        });

        const snapshot = new DocumentAnalysisSnapshotBuilder().build(document);

        assert.strictEqual(snapshot.version, document.version);
        assert.deepStrictEqual(snapshot.missingBlockEnds, []);
        assert.deepStrictEqual(snapshot.blocks.map((block) => block.startLine), [1, 9]);
        assert.deepStrictEqual(snapshot.blocks[0].parameters.map((parameter) => parameter.name), ['input']);
        assert.deepStrictEqual(snapshot.blocks[0].variables.map((variable) => variable.name), ['value']);
        assert.deepStrictEqual(snapshot.modules.map((module) => module.name), ['beta', 'alpha']);
    });

    test('reports missing ends without reparsing the document', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'uniface',
            content: 'entry incomplete\nvalue = 1',
        });

        const snapshot = new DocumentAnalysisSnapshotBuilder().build(document);

        assert.deepStrictEqual(snapshot.missingBlockEnds, [
            { blockType: 'entry', name: 'incomplete', line: 0 },
        ]);
    });
});

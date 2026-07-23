import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { DeclareVariableCommand } from '../declareVariableCommand';

suite('DeclareVariableCommand', () => {
    const documentUri = vscode.Uri.parse('untitled:declare-variable.uniface');
    const block: BlockCode = {
        text: '',
        startLine: 3,
        lines: ['entry sample', '    variables', '    endvariables', 'end'],
    };

    test('does not open the document when type selection is cancelled', async () => {
        let openDocumentCalled = false;
        const command = new DeclareVariableCommand({
            selectDataType: async () => undefined,
            openDocument: async () => {
                openDocumentCalled = true;
                throw new Error('The document must not be opened');
            },
            getBlock: () => block,
            getVariables: () => [],
            getParameters: () => [],
            createInsertion: () => ({ line: 0, text: '' }),
            applyEdit: async () => true,
        });

        await command.execute(documentUri, 'value', 5);

        assert.strictEqual(openDocumentCalled, false);
    });

    test('does not apply an edit when the usage is outside a block', async () => {
        let applyEditCalled = false;
        const command = new DeclareVariableCommand({
            selectDataType: async () => 'string',
            openDocument: async () => createDocumentStub(documentUri),
            getBlock: () => null,
            getVariables: () => [],
            getParameters: () => [],
            createInsertion: () => ({ line: 0, text: '' }),
            applyEdit: async () => {
                applyEditCalled = true;
                return true;
            },
        });

        await command.execute(documentUri, 'value', 5);

        assert.strictEqual(applyEditCalled, false);
    });

    test('does not declare a variable that is already declared, regardless of casing', async () => {
        let createInsertionCalled = false;
        const command = new DeclareVariableCommand({
            selectDataType: async () => 'string',
            openDocument: async () => createDocumentStub(documentUri),
            getBlock: () => block,
            getVariables: () => [{ name: 'existingValue', dataType: 'string', line: 4 }],
            getParameters: () => [],
            createInsertion: () => {
                createInsertionCalled = true;
                return { line: 0, text: '' };
            },
            applyEdit: async () => true,
        });

        await command.execute(documentUri, 'EXISTINGVALUE', 5);

        assert.strictEqual(createInsertionCalled, false);
    });

    test('creates and applies an insertion for an undeclared variable', async () => {
        let appliedEdit: vscode.WorkspaceEdit | undefined;
        const command = new DeclareVariableCommand({
            selectDataType: async () => 'numeric',
            openDocument: async () => createDocumentStub(documentUri),
            getBlock: () => block,
            getVariables: () => [],
            getParameters: () => [],
            createInsertion: (receivedBlock, name, dataType) => {
                assert.strictEqual(receivedBlock, block);
                assert.strictEqual(name, 'total');
                assert.strictEqual(dataType, 'numeric');
                return { line: 5, text: '        numeric total\n' };
            },
            applyEdit: async (edit) => {
                appliedEdit = edit;
                return true;
            },
        });

        await command.execute(documentUri, 'total', 7);

        assert.ok(appliedEdit);
        assert.deepStrictEqual([...appliedEdit.entries()], [
            [documentUri, [new vscode.TextEdit(new vscode.Range(5, 0, 5, 0), '        numeric total\n')]],
        ]);
    });
});

function createDocumentStub(uri: vscode.Uri): vscode.TextDocument {
    return { uri } as vscode.TextDocument;
}

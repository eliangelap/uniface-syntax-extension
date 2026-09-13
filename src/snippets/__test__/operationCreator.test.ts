import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { OperationCreator, isValidOperationName } from '../operationCreator';

interface OperationCreatorTestState {
    inputName: string | undefined;
    languageId: string;
    insertResult: boolean;
    snippets: vscode.SnippetString[];
    errors: string[];
}

function createOperationCreator(state: OperationCreatorTestState): OperationCreator {
    const editor = {
        document: { languageId: state.languageId },
        insertSnippet: async (snippet: vscode.SnippetString) => {
            state.snippets.push(snippet);
            return state.insertResult;
        },
    } as unknown as vscode.TextEditor;

    return new OperationCreator({
        getActiveTextEditor: () => editor,
        showInputBox: async () => state.inputName,
        showErrorMessage: async (message) => {
            state.errors.push(message);
            return undefined;
        },
    });
}

suite('OperationCreator', () => {
    test('inserts a snippet with a trimmed valid operation name', async () => {
        const state: OperationCreatorTestState = {
            inputName: ' validOperation ',
            languageId: 'uniface',
            insertResult: true,
            snippets: [],
            errors: [],
        };

        await createOperationCreator(state).promptAndInsert();

        assert.strictEqual(state.errors.length, 0);
        assert.strictEqual(state.snippets.length, 1);
        assert.ok(state.snippets[0].value.includes('operation validOperation'));
        assert.ok(state.snippets[0].value.includes('end ;validOperation'));
    });

    test('rejects invalid names and incompatible editors', async () => {
        const invalidNameState: OperationCreatorTestState = {
            inputName: 'invalid name',
            languageId: 'uniface',
            insertResult: true,
            snippets: [],
            errors: [],
        };
        const incompatibleEditorState: OperationCreatorTestState = {
            inputName: 'validOperation',
            languageId: 'plaintext',
            insertResult: true,
            snippets: [],
            errors: [],
        };

        await createOperationCreator(invalidNameState).promptAndInsert();
        await createOperationCreator(incompatibleEditorState).promptAndInsert();

        assert.strictEqual(invalidNameState.snippets.length, 0);
        assert.strictEqual(incompatibleEditorState.snippets.length, 0);
        assert.strictEqual(invalidNameState.errors.length, 1);
        assert.strictEqual(incompatibleEditorState.errors.length, 1);
    });

    test('does nothing when cancelled and reports insertion failures', async () => {
        const cancelledState: OperationCreatorTestState = {
            inputName: undefined,
            languageId: 'uniface',
            insertResult: true,
            snippets: [],
            errors: [],
        };
        const failedInsertionState: OperationCreatorTestState = {
            inputName: 'validOperation',
            languageId: 'uniface',
            insertResult: false,
            snippets: [],
            errors: [],
        };

        await createOperationCreator(cancelledState).promptAndInsert();
        await createOperationCreator(failedInsertionState).promptAndInsert();

        assert.strictEqual(cancelledState.snippets.length, 0);
        assert.strictEqual(cancelledState.errors.length, 0);
        assert.strictEqual(failedInsertionState.snippets.length, 1);
        assert.strictEqual(failedInsertionState.errors.length, 1);
    });

    test('validates operation names', () => {
        assert.strictEqual(isValidOperationName('operation_1'), true);
        assert.strictEqual(isValidOperationName('operation-name'), false);
    });
});

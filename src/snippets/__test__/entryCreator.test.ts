import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { EntryCreator, isValidEntryName } from '../entryCreator';

interface EntryCreatorTestState {
    inputName: string | undefined;
    languageId: string;
    insertResult: boolean;
    snippets: vscode.SnippetString[];
    errors: string[];
}

function createEntryCreator(state: EntryCreatorTestState): EntryCreator {
    const editor = {
        document: { languageId: state.languageId },
        insertSnippet: async (snippet: vscode.SnippetString) => {
            state.snippets.push(snippet);
            return state.insertResult;
        },
    } as unknown as vscode.TextEditor;

    return new EntryCreator({
        getActiveTextEditor: () => editor,
        showInputBox: async () => state.inputName,
        showErrorMessage: async (message) => {
            state.errors.push(message);
            return undefined;
        },
    });
}

suite('EntryCreator', () => {
    test('inserts a snippet with a trimmed valid entry name', async () => {
        const state: EntryCreatorTestState = {
            inputName: ' validEntry ',
            languageId: 'uniface',
            insertResult: true,
            snippets: [],
            errors: [],
        };

        await createEntryCreator(state).promptAndInsert();

        assert.strictEqual(state.errors.length, 0);
        assert.strictEqual(state.snippets.length, 1);
        assert.ok(state.snippets[0].value.includes('entry validEntry'));
        assert.ok(state.snippets[0].value.includes('end ;validEntry'));
    });

    test('rejects invalid names and incompatible editors', async () => {
        const invalidNameState: EntryCreatorTestState = {
            inputName: 'invalid name',
            languageId: 'uniface',
            insertResult: true,
            snippets: [],
            errors: [],
        };
        const incompatibleEditorState: EntryCreatorTestState = {
            inputName: 'validEntry',
            languageId: 'plaintext',
            insertResult: true,
            snippets: [],
            errors: [],
        };

        await createEntryCreator(invalidNameState).promptAndInsert();
        await createEntryCreator(incompatibleEditorState).promptAndInsert();

        assert.strictEqual(invalidNameState.snippets.length, 0);
        assert.strictEqual(incompatibleEditorState.snippets.length, 0);
        assert.strictEqual(invalidNameState.errors.length, 1);
        assert.strictEqual(incompatibleEditorState.errors.length, 1);
    });

    test('does nothing when cancelled and reports insertion failures', async () => {
        const cancelledState: EntryCreatorTestState = {
            inputName: undefined,
            languageId: 'uniface',
            insertResult: true,
            snippets: [],
            errors: [],
        };
        const failedInsertionState: EntryCreatorTestState = {
            inputName: 'validEntry',
            languageId: 'uniface',
            insertResult: false,
            snippets: [],
            errors: [],
        };

        await createEntryCreator(cancelledState).promptAndInsert();
        await createEntryCreator(failedInsertionState).promptAndInsert();

        assert.strictEqual(cancelledState.snippets.length, 0);
        assert.strictEqual(cancelledState.errors.length, 0);
        assert.strictEqual(failedInsertionState.snippets.length, 1);
        assert.strictEqual(failedInsertionState.errors.length, 1);
    });

    test('validates entry names', () => {
        assert.strictEqual(isValidEntryName('entry_1'), true);
        assert.strictEqual(isValidEntryName('entry-name'), false);
    });
});

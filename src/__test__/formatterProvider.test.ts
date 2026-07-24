import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { formatterProvider } from '../formatterProvider';

const cancellationToken = {
    isCancellationRequested: false,
    onCancellationRequested: () => ({ dispose: () => undefined }),
} as vscode.CancellationToken;

suite('UnifaceFormatterProvider', () => {
    test('does not format documents with a missing block END', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry incomplete\n    value = 1',
            language: 'uniface',
        });

        const edits = await formatterProvider().provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            cancellationToken
        );

        assert.deepStrictEqual(edits, []);
    });

    test('formats documents with closed blocks', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry valid\nvalue = 1\nend',
            language: 'uniface',
        });

        const edits = await formatterProvider().provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            cancellationToken
        );

        assert.strictEqual(edits?.length, 1);
    });

    test('preserves single-line if statements without increasing subsequent indentation', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: [
                'entry valid',
                'if (outer)',
                'if ($status = $number(value)) message "ready" ; inline comment',
                'nextValue = 1',
                'endif',
                'afterValue = 2',
                'end',
            ].join('\n'),
            language: 'uniface',
        });

        const edits = await formatterProvider().provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            cancellationToken
        );

        assert.strictEqual(
            edits?.[0].newText,
            [
                'entry valid',
                '\tif (outer)',
                '\t\tif ($status = $number(value)) message "ready" ; inline comment',
                '\t\tnextValue = 1',
                '\tendif',
                '\tafterValue = 2',
                'end',
            ].join('\n')
        );
    });

    test('indents selectcase branches and their bodies', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: [
                'entry valid',
                'selectcase vStReceita',
                'case <REC_PENDENTE>',
                'pStcSaida->statusReceita = <TIPO_CONSULTA_PENDENTES>',
                'case <REC_ASSINADO>, <REC_FINALIZADO>',
                'pStcSaida->statusReceita = <TIPO_CONSULTA_ASSINADAS>',
                'elsecase',
                'pStcSaida->statusReceita = <TIPO_CONSULTA_CANCELADAS>',
                'endselectcase',
                'end',
            ].join('\n'),
            language: 'uniface',
        });

        const edits = await formatterProvider().provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            cancellationToken
        );

        assert.strictEqual(
            edits?.[0].newText,
            [
                'entry valid',
                '\tselectcase vStReceita',
                '\t\tcase <REC_PENDENTE>',
                '\t\t\tpStcSaida->statusReceita = <TIPO_CONSULTA_PENDENTES>',
                '\t\tcase <REC_ASSINADO>, <REC_FINALIZADO>',
                '\t\t\tpStcSaida->statusReceita = <TIPO_CONSULTA_ASSINADAS>',
                '\t\telsecase',
                '\t\t\tpStcSaida->statusReceita = <TIPO_CONSULTA_CANCELADAS>',
                '\tendselectcase',
                'end',
            ].join('\n')
        );
    });

    test('restores indentation after nested and empty selectcase blocks', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: [
                'entry valid',
                'selectcase outer',
                'case <OUTER>',
                'selectcase inner',
                'case <INNER>',
                'value = 1',
                'endselectcase',
                'endselectcase',
                'selectcase empty',
                'endselectcase',
                'afterValue = 2',
                'end',
            ].join('\n'),
            language: 'uniface',
        });

        const edits = await formatterProvider().provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            cancellationToken
        );

        assert.strictEqual(
            edits?.[0].newText,
            [
                'entry valid',
                '\tselectcase outer',
                '\t\tcase <OUTER>',
                '\t\t\tselectcase inner',
                '\t\t\t\tcase <INNER>',
                '\t\t\t\t\tvalue = 1',
                '\t\t\tendselectcase',
                '\tendselectcase',
                '\tselectcase empty',
                '\tendselectcase',
                '\tafterValue = 2',
                'end',
            ].join('\n')
        );
    });

    test('formats decrease keywords at zero depth without throwing', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: ['else', 'elseif (condition)', 'catch'].join('\n'),
            language: 'uniface',
        });

        const edits = await formatterProvider().provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            cancellationToken
        );

        assert.strictEqual(edits?.[0].newText, document.getText());
    });
});

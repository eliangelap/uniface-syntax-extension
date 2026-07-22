import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { getGoldReplacement, getGoldReplacements } from '../goldHandler';

suite('GoldHandler', () => {
    test('converts GOLD sequences only inside strings, including strings in comments', () => {
        const stringLine = 'teste = "um+;teste"';
        const commentedStringLine = '; teste = "um+;teste"';
        const commentedCodeLine = '; teste = um+;teste';

        assert.ok(getGoldReplacement(stringLine, stringLine.indexOf(';')));
        assert.ok(getGoldReplacement(commentedStringLine, commentedStringLine.indexOf(';', 1)));
        assert.strictEqual(getGoldReplacement(commentedCodeLine, commentedCodeLine.lastIndexOf(';')), null);
    });

    test('does not convert sequences outside strings or after a closed string', () => {
        const line = 'teste = "texto" +;';

        assert.strictEqual(getGoldReplacement(line, line.indexOf(';')), null);
    });

    test('recognizes single-quoted strings and escaped quotes', () => {
        const singleQuotedLine = "teste = 'um+;teste'";
        const escapedQuoteLine = 'teste = "um\\"+;teste"';

        assert.ok(getGoldReplacement(singleQuotedLine, singleQuotedLine.indexOf(';')));
        assert.ok(getGoldReplacement(escapedQuoteLine, escapedQuoteLine.indexOf(';')));
    });

    test('finds GOLD replacements for multiple simple changes', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '"a+; b+;"',
            language: 'uniface',
        });
        const changes = [
            { rangeOffset: 3, rangeLength: 0, text: ';' },
            { rangeOffset: 6, rangeLength: 0, text: ';' },
        ] as vscode.TextDocumentContentChangeEvent[];

        const ranges = getGoldReplacements(document, changes);

        assert.deepStrictEqual(
            ranges.map((range) => [range.start.character, range.end.character]),
            [
                [2, 4],
                [6, 8],
            ]
        );
    });
});

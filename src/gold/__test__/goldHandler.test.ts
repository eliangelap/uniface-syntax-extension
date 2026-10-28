import * as assert from 'node:assert';
import * as vscode from 'vscode';
import {
    getGoldReplacement,
    getGoldReplacements,
    isInsideString,
    registerGoldInterceptor,
} from '../goldHandler';

suite('GoldHandler', () => {
    test('converts GOLD sequences only inside strings, including strings in comments', () => {
        const stringLine = 'teste = "um+;teste"';
        const commentedStringLine = '; teste = "um+;teste"';
        const commentedCodeLine = '; teste = um+;teste';

        assert.ok(getGoldReplacement(stringLine, stringLine.indexOf(';')));
        assert.ok(getGoldReplacement(commentedStringLine, commentedStringLine.indexOf(';', 1)));
        assert.strictEqual(
            getGoldReplacement(commentedCodeLine, commentedCodeLine.lastIndexOf(';')),
            null
        );
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

    test('recognizes GOLD sequences after Uniface escaped quotes', () => {
        const line = 'teste = "texto %%" +;"';

        assert.ok(getGoldReplacement(line, line.indexOf(';')));
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

    test('recognizes escaped delimiters and closed strings', () => {
        assert.strictEqual(isInsideString('value = "text"', 'value = "text"'.length), false);
        const escapedDelimiterLine = 'value = "text %%" +;"';
        assert.strictEqual(
            isInsideString(escapedDelimiterLine, escapedDelimiterLine.indexOf(';')),
            true
        );
        assert.strictEqual(isInsideString("value = 'text+;'", "value = 'text+;'".indexOf(';')), true);
    });

    test('ignores replacement changes and unsupported GOLD sequences', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '"value+;"',
            language: 'uniface',
        });
        const changes = [
            { rangeOffset: 7, rangeLength: 1, text: ';' },
            { rangeOffset: 8, rangeLength: 0, text: 'x' },
        ] as vscode.TextDocumentContentChangeEvent[];

        assert.strictEqual(getGoldReplacement('"value+x"', 7), null);
        assert.deepStrictEqual(getGoldReplacements(document, changes), []);
    });

    test('intercepts a GOLD sequence typed in an active Uniface editor', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '"value+"',
            language: 'uniface',
        });
        const editor = await vscode.window.showTextDocument(document);
        const context = { subscriptions: [] as vscode.Disposable[] } as vscode.ExtensionContext;
        registerGoldInterceptor(context);

        await editor.edit((editBuilder) => {
            editBuilder.insert(new vscode.Position(0, 7), ';');
        });
        await new Promise((resolve) => setTimeout(resolve, 50));

        assert.strictEqual(document.getText(), '"value\x1B"');
        for (const disposable of context.subscriptions) {
            disposable.dispose();
        }
    });
});

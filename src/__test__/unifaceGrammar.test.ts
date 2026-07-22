import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';

interface TextMatePattern {
    name?: string;
    begin?: string;
    end?: string;
    match?: string;
    patterns?: TextMatePattern[];
}

suite('Uniface TextMate grammar', () => {
    function getGrammarPath(): string {
        const extension = vscode.extensions.all.find(
            (candidate) => candidate.packageJSON.name === 'uniface-syntax-extension'
        );

        assert.ok(extension, 'The Uniface extension must be loaded for grammar tests.');

        return path.join(extension.extensionPath, 'syntaxes', 'uniface.tmLanguage.json');
    }

    test('treats only double quotes as string delimiters', () => {
        const grammar = JSON.parse(fs.readFileSync(getGrammarPath(), 'utf8')) as {
            repository: { strings: { patterns: TextMatePattern[] } };
        };
        const stringPatterns = grammar.repository.strings.patterns;

        const doubleQuotePattern = stringPatterns.find(
            (pattern) => pattern.begin === '"' && pattern.end === '"'
        );
        assert.ok(doubleQuotePattern, 'Expected a double-quoted string pattern.');
        assert.strictEqual(doubleQuotePattern.name, 'string.quoted.double.uniface');
        assert.strictEqual(doubleQuotePattern.begin, '"');
        assert.strictEqual(doubleQuotePattern.end, '"');

        assert.strictEqual(
            stringPatterns.some((pattern) => pattern.begin === "'"),
            false
        );
    });

    test('matches longer escapes before their prefixes', () => {
        const grammar = JSON.parse(fs.readFileSync(getGrammarPath(), 'utf8')) as {
            repository: { strings: { patterns: TextMatePattern[] } };
        };
        const stringPatterns = grammar.repository.strings.patterns;
        const doubleQuotePattern = stringPatterns.find(
            (pattern) => pattern.begin === '"' && pattern.end === '"'
        );
        assert.ok(doubleQuotePattern, 'Expected a double-quoted string pattern.');
        const escapePatterns = doubleQuotePattern.patterns ?? [];

        assert.deepStrictEqual(
            escapePatterns.map((pattern) => pattern.match),
            ['%%%', '%%"', '%%']
        );
    });
});

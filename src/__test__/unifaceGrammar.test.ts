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
            (candidate) => candidate.packageJSON.name === 'uniface-sintax-extension'
        );

        assert.ok(extension, 'The Uniface extension must be loaded for grammar tests.');

        return path.join(extension.extensionPath, 'syntaxes', 'uniface.tmLanguage.json');
    }

    test('treats double and single quotes as string delimiters', () => {
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

        const singleQuotePattern = stringPatterns.find(
            (pattern) => pattern.begin === "'" && pattern.end === "'"
        );
        assert.ok(singleQuotePattern, 'Expected a single-quoted string pattern.');
        assert.strictEqual(singleQuotePattern.name, 'string.quoted.single.uniface');
        assert.strictEqual(singleQuotePattern.begin, "'");
        assert.strictEqual(singleQuotePattern.end, "'");
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

    test('matches single-quote escapes without treating double quotes as delimiters', () => {
        const grammar = JSON.parse(fs.readFileSync(getGrammarPath(), 'utf8')) as {
            repository: { strings: { patterns: TextMatePattern[] } };
        };
        const singleQuotePattern = grammar.repository.strings.patterns.find(
            (pattern) => pattern.begin === "'" && pattern.end === "'"
        );
        assert.ok(singleQuotePattern, 'Expected a single-quoted string pattern.');

        assert.deepStrictEqual(
            singleQuotePattern.patterns?.map((pattern) => pattern.match),
            ['%%%', "%%'", '%%']
        );
    });

    test('defines blockdata as a string region closed by its opening delimiter', () => {
        const grammar = JSON.parse(fs.readFileSync(getGrammarPath(), 'utf8')) as {
            repository: { blockdata: { patterns: TextMatePattern[] } };
        };
        const blockdata = grammar.repository.blockdata.patterns[0];

        assert.strictEqual(blockdata.name, 'string.unquoted.blockdata.uniface');
        assert.strictEqual(blockdata.begin, '(?i)\\bblockdata\\s+([^\\s])');
        assert.strictEqual(blockdata.end, '^\\s*\\1\\s*$');
    });
});

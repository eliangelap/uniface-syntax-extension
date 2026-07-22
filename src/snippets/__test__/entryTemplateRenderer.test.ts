import * as assert from 'node:assert';
import { EntryTemplateRenderer } from '../renderers/entryTemplateRenderer';

suite('EntryTemplateRenderer', () => {
    const data = {
        entryName: 'sampleEntry',
        author: 'Ada',
        date: '2026-07-22',
    };

    test('uses a multiline configured template and preserves snippet placeholders', () => {
        const renderer = new EntryTemplateRenderer(
            () => 'entry {{entryName}}\n; {{author}} - {{date}}\n${1:code}'
        );

        const snippet = renderer.render(data);

        assert.strictEqual(snippet.value, 'entry sampleEntry\n; Ada - 2026-07-22\n${1:code}');
    });

    test('uses the default template when configuration is invalid or empty', () => {
        const renderer = new EntryTemplateRenderer(() => '   ');

        const snippet = renderer.render(data);

        assert.ok(snippet.value.includes('entry sampleEntry'));
        assert.ok(snippet.value.includes('; Author: Ada'));
    });

    test('supports the legacy array format', () => {
        const renderer = new EntryTemplateRenderer(() => ['entry {{entryName}}', 'end']);

        const snippet = renderer.render(data);

        assert.strictEqual(snippet.value, 'entry sampleEntry\nend');
    });

    test('escapes values before inserting them into snippets', () => {
        const renderer = new EntryTemplateRenderer(() => '{{author}}');

        const snippet = renderer.render({ ...data, author: '$author}' });

        assert.strictEqual(snippet.value, '\\$author\\}');
    });
});

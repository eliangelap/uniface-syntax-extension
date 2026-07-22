import * as assert from 'node:assert';
import { OperationTemplateRenderer } from '../renderers/operationTemplateRenderer';

suite('OperationTemplateRenderer', () => {
    const data = {
        operationName: 'sampleOperation',
        author: 'Ada',
        date: '2026-07-22',
    };

    test('uses a multiline configured template and preserves snippet placeholders', () => {
        const renderer = new OperationTemplateRenderer(
            () => 'operation {{operationName}}\n; {{author}} - {{date}}\n${1:code}'
        );

        const snippet = renderer.render(data);

        assert.strictEqual(
            snippet.value,
            'operation sampleOperation\n; Ada - 2026-07-22\n${1:code}'
        );
    });

    test('uses the default template when configuration is invalid or empty', () => {
        const renderer = new OperationTemplateRenderer(() => '   ');

        const snippet = renderer.render(data);

        assert.ok(snippet.value.includes('operation sampleOperation'));
        assert.ok(snippet.value.includes('; Author: Ada'));
    });

    test('supports the legacy array format', () => {
        const renderer = new OperationTemplateRenderer(() => ['operation {{operationName}}', 'end']);

        const snippet = renderer.render(data);

        assert.strictEqual(snippet.value, 'operation sampleOperation\nend');
    });
});

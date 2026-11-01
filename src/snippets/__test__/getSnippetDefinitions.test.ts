import * as assert from 'node:assert';
import { GetSnippetDefinitions } from '../getSnippetDefinitions.use.case';

suite('GetSnippetDefinitions', () => {
    test('combines built-in snippet settings with custom snippets', () => {
        const values: Record<string, unknown> = {
            'snippets.wlent.prefix': 'wlent',
            'snippets.wlent.body': 'while',
            'snippets.custom': { extra: { prefix: 'ex', body: ['x'] } },
        };

        const definitions = new GetSnippetDefinitions().execute({
            get: <T>(key: string) => values[key] as T,
        } as never);

        assert.deepStrictEqual(definitions.wlent, { prefix: 'wlent', body: 'while' });
        assert.deepStrictEqual(definitions.extra, { prefix: 'ex', body: ['x'] });
        assert.deepStrictEqual(definitions.retv, { prefix: undefined, body: undefined });
    });
});

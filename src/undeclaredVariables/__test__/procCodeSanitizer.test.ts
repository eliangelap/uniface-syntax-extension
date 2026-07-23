import * as assert from 'node:assert';
import { ProcCodeSanitizer } from '../procCodeSanitizer';

suite('ProcCodeSanitizer', () => {
    test('masks literals, constants, entity fields, and struct fields without changing positions', () => {
        const code = 'value = "text" + <CONSTANT> + field.entity + data->property ; comment';
        const sanitized = new ProcCodeSanitizer().sanitize(code);

        assert.strictEqual(sanitized.length, code.length);
        assert.doesNotMatch(sanitized, /text|CONSTANT|field|entity|property|comment/);
        assert.match(sanitized, /value/);
        assert.match(sanitized, /data->/);
    });
});

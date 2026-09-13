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

    test('masks a string continued with %\\ until its closing delimiter on the next line', () => {
        const lines = [
            'value = "first line %\\',
            '    second line with identifier"',
            'otherValue = 1',
        ];

        const sanitizedLines = new ProcCodeSanitizer().sanitizeLines(lines);

        assert.strictEqual(sanitizedLines[0].length, lines[0].length);
        assert.strictEqual(sanitizedLines[1].length, lines[1].length);
        assert.doesNotMatch(sanitizedLines[1], /second|identifier/);
        assert.match(sanitizedLines[2], /otherValue/);
    });
});

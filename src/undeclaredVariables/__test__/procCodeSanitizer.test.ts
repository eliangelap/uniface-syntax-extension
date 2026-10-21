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

    test('keeps strings open after a Uniface escaped delimiter', () => {
        const code = 'message "text %%" undeclaredVariable"';
        const sanitized = new ProcCodeSanitizer().sanitize(code);

        assert.strictEqual(sanitized.length, code.length);
        assert.doesNotMatch(sanitized, /undeclaredVariable/);
    });

    test('closes strings after a Uniface variable interpolation ending in %%%', () => {
        const code = 'message "%%vDsVariavel%%%" undeclaredVariable';
        const sanitized = new ProcCodeSanitizer().sanitize(code);

        assert.strictEqual(sanitized.length, code.length);
        assert.doesNotMatch(sanitized, /vDsVariavel/);
        assert.match(sanitized, /undeclaredVariable/);
    });

    test('keeps a closing quote after an interpolation ending in %%% before a continuation', () => {
        const lines = [
            'message "%%vDsVariavel%%%%", %\\',
            '    "stringArgument", undeclaredVariable',
        ];
        const sanitizedLines = new ProcCodeSanitizer().sanitizeLines(lines);

        assert.doesNotMatch(sanitizedLines[1], /stringArgument/);
        assert.match(sanitizedLines[1], /undeclaredVariable/);
    });

    test('keeps a continued literal open after %%% and exposes code after its closing quote', () => {
        const lines = [
            'message "progress %%%, %\\',
            '    followed by remainingText" + actualVariable',
        ];

        const sanitizedLines = new ProcCodeSanitizer().sanitizeLines(lines);

        assert.doesNotMatch(sanitizedLines[1], /followed|remainingText/);
        assert.match(sanitizedLines[1], /actualVariable/);
    });

    test('finds roots of variable interpolations without treating literal text as code', () => {
        const lines = [
            'message "%%undeclaredValue%%%"',
            'message "%%declaredValue->field%%%"',
            'message "%%entity.field%%%"',
        ];

        const references = new ProcCodeSanitizer().getInterpolatedVariables(lines);

        assert.deepStrictEqual(references, [
            [{ name: 'undeclaredValue', start: 11 }],
            [{ name: 'declaredValue', start: 11 }],
            [],
        ]);
    });
});

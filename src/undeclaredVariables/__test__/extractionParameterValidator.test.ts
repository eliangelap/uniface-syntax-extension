import * as assert from 'node:assert';
import { ExtractionParameterValidator } from '../extractionParameterValidator';

suite('ExtractionParameterValidator', () => {
    test('masks valid numeric parameters and reports invalid ones', () => {
        const result = new ExtractionParameterValidator().validate(
            'value[round,2] + value[fraction,2]',
            [{ name: 'value', dataType: 'numeric', line: 0 }],
            3
        );

        assert.doesNotMatch(result.code, /round|fraction/);
        assert.deepStrictEqual(result.invalidUsages.map((usage) => usage.name), ['fraction,2']);
    });
});

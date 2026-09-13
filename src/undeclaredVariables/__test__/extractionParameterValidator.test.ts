import * as assert from 'node:assert';
import { ExtractionParameterValidator } from '../extractionParameterValidator';

suite('ExtractionParameterValidator', () => {
    test('masks valid numeric parameters and reports invalid ones', () => {
        const result = new ExtractionParameterValidator().validate(
            'value[R] + value[R,2] + value[r, 2] + value[ROUND,2] + value[fraction,2] + value[R,texto]',
            [{ name: 'value', dataType: 'numeric', line: 0 }],
            3
        );

        assert.doesNotMatch(result.code, /R|r|ROUND/);
        assert.deepStrictEqual(result.invalidUsages.map((usage) => usage.name), ['fraction,2', 'R,texto']);
    });

    test('accepts substring extraction parameters for date values', () => {
        const result = new ExtractionParameterValidator().validate(
            '$date[1,4] + $date[5, 6] + $date[invalid]',
            [],
            3
        );

        assert.doesNotMatch(result.code, /1,4|5, 6/);
        assert.deepStrictEqual(result.invalidUsages.map((usage) => usage.name), ['invalid']);
    });
});

import * as assert from 'node:assert';
import { ExtractionParameterValidator } from '../extractionParameterValidator';

suite('ExtractionParameterValidator', () => {
    test('masks extraction parameters from recognized declared values without reporting diagnostics', () => {
        const result = new ExtractionParameterValidator().validate(
            'pCdSafra[1:4] + pCdSafra[5:8] + dateValue[invalid] + datetimeValue[anything] + stringValue[text] + timeValue[Y]',
            [
                { name: 'pCdSafra', dataType: 'numeric', line: 0 },
                { name: 'dateValue', dataType: 'date', line: 0 },
                { name: 'datetimeValue', dataType: 'datetime', line: 0 },
                { name: 'stringValue', dataType: 'string', line: 0 },
                { name: 'timeValue', dataType: 'time', line: 0 },
            ]
        );

        assert.doesNotMatch(result.code, /1:4|5:8|invalid|anything|text|Y/);
    });

    test('masks extraction parameters from Uniface system values without reporting diagnostics', () => {
        const result = new ExtractionParameterValidator().validate(
            '$date[invalid] + $clock[invalid] + $datim[invalid]',
            []
        );

        assert.doesNotMatch(result.code, /invalid/);
    });

    test('masks parameters applied to parenthesized numeric expressions', () => {
        const result = new ExtractionParameterValidator().validate(
            '((v_nr_atual / v_nr_total) * 100)[round] + (v_nr_atual / v_nr_total)[round, 2]',
            [
                { name: 'v_nr_atual', dataType: 'numeric', line: 0 },
                { name: 'v_nr_total', dataType: 'numeric', line: 0 },
            ]
        );

        assert.doesNotMatch(result.code, /round/);
    });

    test('keeps parameters visible when a parenthesized expression is not numeric', () => {
        const result = new ExtractionParameterValidator().validate(
            '(v_nr_atual / undeclaredValue)[round]',
            [{ name: 'v_nr_atual', dataType: 'numeric', line: 0 }]
        );

        assert.match(result.code, /undeclaredValue/);
        assert.match(result.code, /round/);
    });
});

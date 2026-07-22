import * as assert from 'node:assert';
import { GetParametersFromBlock } from '../getParametersFromBlock.use.case';

suite('GetParametersFromBlock', () => {
    test('returns typed parameters with their actual document lines', () => {
        const block = {
            text: [
                'entry sampleEntry',
                '    params',
                '        string firstParameter : in',
                '        ; numeric ignoredParameter : out',
                '        numeric secondParameter : inout',
                '    endparams',
                'end',
            ].join('\n'),
            startLine: 10,
            lines: [
                'entry sampleEntry',
                '    params',
                '        string firstParameter : in',
                '        ; numeric ignoredParameter : out',
                '        numeric secondParameter : inout',
                '    endparams',
                'end',
            ],
        };

        const parameters = new GetParametersFromBlock().execute(block);

        assert.deepStrictEqual(parameters, [
            {
                dataType: 'string',
                name: 'firstParameter',
                line: 12,
            },
            {
                dataType: 'numeric',
                name: 'secondParameter',
                line: 14,
            },
        ]);
    });

    test('does not treat params text outside a delimiter line as a block', () => {
        const block = {
            text: 'entry sampleEntry\n; params\nstring ignored : in\nendparams\nend',
            startLine: 0,
            lines: ['entry sampleEntry', '; params', 'string ignored : in', 'endparams', 'end'],
        };

        const parameters = new GetParametersFromBlock().execute(block);

        assert.deepStrictEqual(parameters, []);
    });
});

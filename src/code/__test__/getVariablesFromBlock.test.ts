import * as assert from 'node:assert';
import { GetVariablesFromBlock } from '../getVariablesFromBlock.use.case';

suite('GetVariablesFromBlock', () => {
    test('supports delimiters with comments and multiple variables', () => {
        const block = {
            text: [
                'entry sampleEntry',
                'variables ; declarations',
                'string firstVariable, secondVariable ; comment',
                'endvariables ; end declarations',
                'string outsideVariable',
                'end',
            ].join('\n'),
            startLine: 10,
            lines: [
                'entry sampleEntry',
                'variables ; declarations',
                'string firstVariable, secondVariable ; comment',
                'endvariables ; end declarations',
                'string outsideVariable',
                'end',
            ],
        };

        const variables = new GetVariablesFromBlock().execute(block);

        assert.deepStrictEqual(variables, [
            {
                dataType: 'string',
                name: 'firstVariable',
                line: 12,
            },
            {
                dataType: 'string',
                name: 'secondVariable',
                line: 12,
            },
        ]);
    });

    test('ignores invalid declarations and empty names', () => {
        const block = {
            text: 'entry sampleEntry\nvariables\nmystring ignored\nstring first,,second\nendvariables\nend',
            startLine: 0,
            lines: [
                'entry sampleEntry',
                'variables',
                'mystring ignored',
                'string first,,second',
                'endvariables',
                'end',
            ],
        };

        const variables = new GetVariablesFromBlock().execute(block);

        assert.deepStrictEqual(
            variables.map((variable) => variable.name),
            ['first', 'second']
        );
    });
});

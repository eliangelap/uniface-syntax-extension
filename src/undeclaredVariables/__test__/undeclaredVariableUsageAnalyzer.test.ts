import * as assert from 'node:assert';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { UndeclaredVariableUsageAnalyzer } from '../undeclaredVariableUsageAnalyzer';

suite('UndeclaredVariableUsageAnalyzer', () => {
    test('finds undeclared assignment and statement arguments', () => {
        const block: BlockCode = {
            text: '',
            startLine: 10,
            lines: [
                'entry sample',
                'params',
                '    string parameter : in',
                'endparams',
                'variables',
                '    string declaredValue',
                'endvariables',
                'result = $replace(parameter, 1, "value", "other", -1)',
                'creocc "entity", index',
                '; ignoredComment = declaredValue',
                'declaredValue = "ignoredString"',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, [
            'parameter',
            'declaredValue',
        ]);

        assert.deepStrictEqual(
            usages.map((usage) => ({ name: usage.name, line: usage.range.start.line })),
            [
                { name: 'result', line: 17 },
                { name: 'index', line: 18 },
            ]
        );
    });

    test('matches declared variables without casing differences', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', 'variables', 'string value', 'endvariables', 'VALUE = 1', 'end'],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, ['value']);

        assert.deepStrictEqual(usages, []);
    });
});

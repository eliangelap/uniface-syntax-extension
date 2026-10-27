import * as assert from 'node:assert';
import { DeclaredVariable } from '../../code/getVariablesFromBlock.use.case';
import { VariableUsageAnalyzer } from '../variableUsageAnalyzer';

suite('VariableUsageAnalyzer', () => {
    const variables: DeclaredVariable[] = [
        { name: 'value', dataType: 'string', line: 2 },
        { name: 'value2', dataType: 'string', line: 2 },
        { name: 'unusedValue', dataType: 'string', line: 2 },
    ];

    test('finds variables read in executable code after endvariables', () => {
        const usedVariables = new VariableUsageAnalyzer().getUsedVariables(
            [
                'variables',
                'string value, value2, unusedValue',
                'endvariables ; declarations end here',
                'value = value2',
            ],
            variables
        );

        assert.deepStrictEqual([...usedVariables].sort(), ['value2']);
    });

    test('ignores complete comments, inline comments, and strings', () => {
        const usedVariables = new VariableUsageAnalyzer().getUsedVariables(
            [
                'variables',
                'string value, value2, unusedValue',
                'endvariables',
                '; value',
                'message "value2"',
                "message 'unusedValue'",
                'return 0 ; unusedValue',
            ],
            variables
        );

        assert.deepStrictEqual([...usedVariables], []);
    });

    test('does not count assignments as reads', () => {
        const usedVariables = new VariableUsageAnalyzer().getUsedVariables(
            ['variables', 'string value, value2, unusedValue', 'endvariables', 'value2 = 1'],
            variables
        );

        assert.deepStrictEqual([...usedVariables], []);
    });

    test('counts interpolated variables as reads and reports missing initialization', () => {
        const usage = new VariableUsageAnalyzer().getUsageSummary(
            [
                'variables',
                'string teste, teste2',
                'endvariables',
                'teste2 = "%%teste%%%"',
            ],
            [
                { name: 'teste', dataType: 'string', line: 1 },
                { name: 'teste2', dataType: 'string', line: 1 },
            ]
        );

        assert.deepStrictEqual([...usage.readVariables], ['teste']);
        assert.deepStrictEqual(usage.uninitializedReads, [{ name: 'teste', line: 3, start: 12 }]);
    });

    test('does not report a variable initialized before its first read', () => {
        const usage = new VariableUsageAnalyzer().getUsageSummary(
            ['variables', 'string value', 'endvariables', 'value = "ready"', 'message "%%value%%%"'],
            [{ name: 'value', dataType: 'string', line: 1 }]
        );

        assert.deepStrictEqual([...usage.readVariables], ['value']);
        assert.deepStrictEqual(usage.uninitializedReads, []);
    });

    test('reports a direct read before its first assignment', () => {
        const usage = new VariableUsageAnalyzer().getUsageSummary(
            ['variables', 'string value, result', 'endvariables', 'result = value', 'value = "ready"'],
            [
                { name: 'value', dataType: 'string', line: 1 },
                { name: 'result', dataType: 'string', line: 1 },
            ]
        );

        assert.deepStrictEqual([...usage.readVariables], ['value']);
        assert.deepStrictEqual(usage.uninitializedReads, [{ name: 'value', line: 3, start: 9 }]);
    });

    test('ignores variables in strings with Uniface escaped delimiters and continuations', () => {
        const usedVariables = new VariableUsageAnalyzer().getUsedVariables(
            [
                'variables',
                'string value, value2, unusedValue',
                'endvariables',
                'message "text %%" value %\\',
                'value2"',
            ],
            variables
        );

        assert.deepStrictEqual([...usedVariables], []);
    });

    test('finds code after a continued literal ending with %%%', () => {
        const usedVariables = new VariableUsageAnalyzer().getUsedVariables(
            [
                'variables',
                'string remainingText, actualVariable',
                'endvariables',
                'message "progress %%%, %\\',
                '    followed by remainingText" + actualVariable',
            ],
            [
                { name: 'remainingText', dataType: 'string', line: 1 },
                { name: 'actualVariable', dataType: 'string', line: 1 },
            ]
        );

        assert.deepStrictEqual([...usedVariables], ['actualVariable']);
    });

    test('does not count variables written inside blockdata as used', () => {
        const usedVariables = new VariableUsageAnalyzer().getUsedVariables(
            ['variables', 'string value', 'endvariables', 'dsTexto: blockdata @', 'value', '@'],
            [{ name: 'value', dataType: 'string', line: 1 }]
        );

        assert.deepStrictEqual([...usedVariables], []);
    });
});

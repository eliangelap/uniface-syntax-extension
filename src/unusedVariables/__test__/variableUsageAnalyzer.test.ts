import * as assert from 'node:assert';
import { DeclaredVariable } from '../../code/getVariablesFromBlock.use.case';
import { VariableUsageAnalyzer } from '../variableUsageAnalyzer';

suite('VariableUsageAnalyzer', () => {
    const variables: DeclaredVariable[] = [
        { name: 'value', dataType: 'string', line: 2 },
        { name: 'value2', dataType: 'string', line: 2 },
        { name: 'unusedValue', dataType: 'string', line: 2 },
    ];

    test('finds only variables used in executable code after endvariables', () => {
        const usedVariables = new VariableUsageAnalyzer().getUsedVariables(
            [
                'variables',
                'string value, value2, unusedValue',
                'endvariables ; declarations end here',
                'value = value2',
            ],
            variables
        );

        assert.deepStrictEqual([...usedVariables].sort(), ['value', 'value2']);
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

    test('does not confuse variable names with longer identifiers', () => {
        const usedVariables = new VariableUsageAnalyzer().getUsedVariables(
            ['variables', 'string value, value2, unusedValue', 'endvariables', 'value2 = 1'],
            variables
        );

        assert.deepStrictEqual([...usedVariables], ['value2']);
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

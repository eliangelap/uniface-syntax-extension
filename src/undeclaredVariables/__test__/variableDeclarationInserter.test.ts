import * as assert from 'node:assert';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { VariableDeclarationInserter } from '../variableDeclarationInserter';

suite('VariableDeclarationInserter', () => {
    const inserter = new VariableDeclarationInserter();

    test('inserts a declaration before endvariables', () => {
        const block: BlockCode = {
            text: '',
            startLine: 5,
            lines: ['entry sample', '    variables', '    endvariables', 'end'],
        };

        assert.deepStrictEqual(inserter.create(block, 'value', 'string'), {
            line: 7,
            character: 0,
            text: '        string value\n',
        });
    });

    test('adds a variable to the last declaration of the same type', () => {
        const block: BlockCode = {
            text: '',
            startLine: 10,
            lines: [
                'entry sample',
                '    variables',
                '        string firstValue',
                '        numeric total',
                '        STRING secondValue ; current values',
                '    endvariables',
                'end',
            ],
        };

        assert.deepStrictEqual(inserter.create(block, 'thirdValue', 'string'), {
            line: 14,
            character: 26,
            text: ', thirdValue',
        });
    });

    test('inserts a new line when the selected type is not declared', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', '    variables', '        string description', '    endvariables', 'end'],
        };

        assert.deepStrictEqual(inserter.create(block, 'total', 'numeric'), {
            line: 3,
            character: 0,
            text: '        numeric total\n',
        });
    });

    test('creates the variables section after endparams when absent', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', '    params', '    endparams', '    result = 1', 'end'],
        };

        assert.deepStrictEqual(inserter.create(block, 'result', 'numeric'), {
            line: 3,
            character: 0,
            text: '    variables\n        numeric result\n    endvariables\n',
        });
    });
});

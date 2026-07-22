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
            text: '        string value\n',
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
            text: '    variables\n        numeric result\n    endvariables\n',
        });
    });
});

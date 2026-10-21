import * as assert from 'node:assert';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { ParameterDeclarationInserter } from '../parameterDeclarationInserter';

suite('ParameterDeclarationInserter', () => {
    const inserter = new ParameterDeclarationInserter();

    test('inserts a parameter on its own line before endparams', () => {
        const block: BlockCode = {
            text: '',
            startLine: 5,
            lines: [
                'entry sample',
                '    params',
                '        string firstValue : in',
                '    endparams',
                '    variables',
                '    endvariables',
                'end',
            ],
        };

        assert.deepStrictEqual(inserter.create(block, 'result', 'numeric', 'out'), {
            line: 8,
            character: 0,
            text: '        numeric result : out\n',
        });
    });

    test('creates the params section before variables when absent', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', '    variables', '        string description', '    endvariables', 'end'],
        };

        assert.deepStrictEqual(inserter.create(block, 'value', 'string', 'inout'), {
            line: 1,
            character: 0,
            text: '    params\n        string value : inout\n    endparams\n',
        });
    });

    test('creates the params section before the first statement when variables are absent', () => {
        const block: BlockCode = {
            text: '',
            startLine: 10,
            lines: ['entry sample', '    result = 1', 'end'],
        };

        assert.deepStrictEqual(inserter.create(block, 'value', 'string', 'in'), {
            line: 11,
            character: 0,
            text: '    params\n        string value : in\n    endparams\n',
        });
    });
});

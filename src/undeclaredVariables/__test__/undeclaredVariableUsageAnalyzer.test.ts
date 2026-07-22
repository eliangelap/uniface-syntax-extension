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

    test('ignores constants enclosed in angle brackets', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', 'case <REC_ASSINADO>', 'end'],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, []);

        assert.deepStrictEqual(usages, []);
    });

    test('ignores include directives', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', '#include LIB_COAMO:G_VLD_ACTIVATE_CTX', 'end'],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, []);

        assert.deepStrictEqual(usages, []);
    });

    test('considers constants defined with #define declared in the block', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                '#define DEF_CONTEXTO = $string("<$componentname>, <$trigger>")',
                'message DEF_CONTEXTO',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, []);

        assert.deepStrictEqual(usages, []);
    });

    test('ignores function names in call statements but analyzes their arguments', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'call PL_ERRO_TRGMSG()',
                'call PL_ERRO_TRGMSG',
                'call MinhaFuncao(valor)',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, []);

        assert.deepStrictEqual(usages.map((usage) => usage.name), ['valor']);
    });

    test('ignores statement modifiers but analyzes variables after them', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'clear/e "trec_recebase"',
                'clear/all VARIAVEL',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, []);

        assert.deepStrictEqual(usages.map((usage) => usage.name), ['VARIAVEL']);
    });

    test('validates only the root variable of struct access chains', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'vStcEntrada->codigoUnidade = pStcEntrada->payload->unidadeCoamo->codigo',
                'end',
            ],
        };

        const usageAnalyzer = new UndeclaredVariableUsageAnalyzer();

        assert.deepStrictEqual(
            usageAnalyzer.getUndeclaredUsages(block, ['vStcEntrada', 'pStcEntrada']),
            []
        );
        assert.deepStrictEqual(
            usageAnalyzer.getUndeclaredUsages(block, ['vStcEntrada']).map((usage) => usage.name),
            ['pStcEntrada']
        );
    });

    test('ignores to in for statements while validating the loop limit', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', 'for contador = 1 to limite', 'endfor', 'end'],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, ['contador']);

        assert.deepStrictEqual(usages.map((usage) => usage.name), ['limite']);
    });
});

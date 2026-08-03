import * as assert from 'node:assert';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { UndeclaredVariableUsageAnalyzer } from '../undeclaredVariableUsageAnalyzer';
import { unknownLabelDiagnosticCode } from '../undeclaredVariablesDiagnosticPublisher';

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

    test('ignores startdefine and enddefine directives', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', '#startdefine CONTEXT', '#enddefine CONTEXT', 'end'],
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

    test('ignores function names in single-line if calls but analyzes their arguments', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'if (v_tp_natop != 1 & p_tp_processo != 3) call pl_envia_email("Tipo inv\u00e1lido")',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, [
            'v_tp_natop',
            'p_tp_processo',
        ]);

        assert.deepStrictEqual(usages, []);

        const usagesWithUndeclaredArgument = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(
            {
                ...block,
                lines: ['entry sample', 'if (v_tp_natop = 1) CALL pl_envia_email(undeclaredValue)', 'end'],
            },
            ['v_tp_natop']
        );

        assert.deepStrictEqual(usagesWithUndeclaredArgument.map((usage) => usage.name), [
            'undeclaredValue',
        ]);
    });

    test('ignores direct entity arguments in $dbocc while validating the rest of the expression', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'if ($dbocc(pfat_cvvecto) <= 0)',
                '    p_ds_erro = undeclaredValue',
                'endif',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, [
            'p_ds_erro',
        ]);

        assert.deepStrictEqual(usages.map((usage) => usage.name), ['undeclaredValue']);
    });

    test('ignores direct entity arguments in $curocc while validating the rest of the expression', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'if ($curocc(pfat_cvvecto) <= 0)',
                '    p_ds_erro = undeclaredValue',
                'endif',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, [
            'p_ds_erro',
        ]);

        assert.deepStrictEqual(usages.map((usage) => usage.name), ['undeclaredValue']);
    });

    test('ignores statement modifiers but analyzes variables after them', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'clear/e "trec_recebase"',
                'clear/all VARIAVEL',
                'store/e/complete "trec_recebase"',
                'store/E/COMPLETE undeclaredValue',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, []);

        assert.deepStrictEqual(usages.map((usage) => usage.name), [
            'VARIAVEL',
            'undeclaredValue',
        ]);
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

    test('ignores struct fields passed to procfunctions while validating the struct root', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'if ($status < 0 | ($number(vStcTemp->responseCode) != 200 & $number(vStcTemp->responseCode) != 201))',
                '    $t_ds_erro$ = $concat("Código do erro ", vStcTemp->responseCode, " ", vStcTemp->restResponse, <DEF_CONTEXTO>)',
                'endif',
                'end',
            ],
        };
        const usageAnalyzer = new UndeclaredVariableUsageAnalyzer();

        assert.deepStrictEqual(usageAnalyzer.getUndeclaredUsages(block, ['vStcTemp']), []);
        assert.deepStrictEqual(usageAnalyzer.getUndeclaredUsages(block, []).map((usage) => usage.name), [
            'vStcTemp',
            'vStcTemp',
            'vStcTemp',
            'vStcTemp',
        ]);
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

    test('ignores operation names in activate statements while validating arguments', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'activate $instancename.atualizaStatusReceitaDigital(vStcEntrada, $t_ds_erro$)',
                'activate vNmInstancia.alteraStatusReceitaPend(pStcEntrada, "", "")',
                'activate "GPRDO012".OBTEM_FIELD_PK("GPRD_PRODUTO", vCdRegmapa)',
                'activate vNmInstancia.outraOperation(argumentoNaoDeclarado)',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, [
            'vStcEntrada',
            'vNmInstancia',
            'pStcEntrada',
            'vCdRegmapa',
        ]);

        assert.deepStrictEqual(usages.map((usage) => usage.name), ['argumentoNaoDeclarado']);
    });

    test('ignores qualified entity fields while validating the remaining expression', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'cd_unidade.trec_contrrec = vCdUnidade',
                'cd_unidade.trec_recebase/init = vCdUnidade',
                'cd_unidade.trec_recebase/INIT = vCdUnidade',
                'cd_produto.trec_produto = variavelNaoDeclarada',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, [
            'vCdUnidade',
        ]);

        assert.deepStrictEqual(usages.map((usage) => usage.name), ['variavelNaoDeclarada']);
    });

    test('ignores calls to local functions with a return value but validates other identifiers', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'result = RETURNINGFUNCTION() + undeclaredValue',
                'returningFunction = 1',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(
            block,
            ['result'],
            ['returningFunction']
        );

        assert.deepStrictEqual(usages.map((usage) => usage.name), [
            'undeclaredValue',
            'returningFunction',
        ]);
    });

    test('ignores selectdb fields while validating conditions and the destination variable', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'selectdb nm_cultrecagr, %\\',
                '    ds_cultrecagr %\\',
                '    from "gprd_cultura_s1" %\\',
                '    u_where cd_cultura.gprd_cultura_s1 = undeclaredCondition %\\',
                '    to undeclaredDestination',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, []);

        assert.deepStrictEqual(usages.map((usage) => usage.name), [
            'undeclaredCondition',
            'undeclaredDestination',
        ]);
    });

    test('validates goto labels within the same block without treating them as variables', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'goto PROX_ITEM',
                'Prox_Item: declaredValue = 1',
                'goto missingLabel',
                'undeclaredValue = 1',
                '; goto ignoredLabel',
                '; ignoredLabel:',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, [
            'declaredValue',
        ]);

        assert.deepStrictEqual(
            usages.map((usage) => ({ name: usage.name, code: usage.diagnosticCode })),
            [
                { name: 'missingLabel', code: unknownLabelDiagnosticCode },
                { name: 'undeclaredValue', code: undefined },
            ]
        );
        assert.strictEqual(usages[0].message, 'Label "missingLabel" is not declared in this block.');
    });

    test('ignores entity fields in compare next and previous statements', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'compare/previous (cd_undrecei, tp_receita, nr_receita) from "trec_recpfitem_s1"',
                'COMPARE / NEXT (cd_undrecei, tp_receita, nr_receita) FROM "trec_recpfitem_s1"',
                'undeclaredValue = 1',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, []);

        assert.deepStrictEqual(usages.map((usage) => usage.name), ['undeclaredValue']);
    });

    test('validates extraction parameters for date, time, and datetime values', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'result = $date[D] + $clock[h] + $datim[s]',
                'result = vDate[Mmm*] + vTime[T] + vDatetime[clock] + vDatetime[Y]',
                'result = undeclaredValue',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(
            block,
            ['result', 'vDate', 'vTime', 'vDatetime'],
            [],
            [
                { name: 'vDate', dataType: 'date', line: 0 },
                { name: 'vTime', dataType: 'time', line: 0 },
                { name: 'vDatetime', dataType: 'datetime', line: 0 },
            ]
        );

        assert.deepStrictEqual(usages.map((usage) => usage.name), ['undeclaredValue']);
    });

    test('reports invalid extraction parameters with a specific diagnostic', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: ['entry sample', 'result = vDate[H] + vTime[Y] + vDatetime[invalid]', 'end'],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(
            block,
            ['result', 'vDate', 'vTime', 'vDatetime'],
            [],
            [
                { name: 'vDate', dataType: 'date', line: 0 },
                { name: 'vTime', dataType: 'time', line: 0 },
                { name: 'vDatetime', dataType: 'datetime', line: 0 },
            ]
        );

        assert.deepStrictEqual(
            usages.map((usage) => ({ name: usage.name, code: usage.diagnosticCode })),
            [
                { name: 'H', code: 'uniface.invalidExtractionParameter' },
                { name: 'Y', code: 'uniface.invalidExtractionParameter' },
                { name: 'invalid', code: 'uniface.invalidExtractionParameter' },
            ]
        );
        assert.strictEqual(
            usages[0].message,
            'Invalid extraction parameter "H" for date value "vDate".'
        );
    });

    test('validates numeric extraction parameters', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'vQtAplicacao = vQtAplicacao[round,2] + vQtAplicacao[trunc] + vQtAplicacao[F] + vQtAplicacao[R]',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(
            block,
            ['vQtAplicacao'],
            [],
            [{ name: 'vQtAplicacao', dataType: 'numeric', line: 0 }]
        );

        assert.deepStrictEqual(usages, []);
    });

    test('accepts extraction parameters for qualified entity fields', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'qt_aplicacao.trec_receitem = qt_aplicacao.trec_receitem[round, 2]',
                'dt_receita.trec_receitem = dt_receita.trec_receitem[D]',
                'hr_receita.trec_receitem = hr_receita.trec_receitem[N]',
                'dh_receita.trec_receitem = dh_receita.trec_receitem[clock]',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, []);

        assert.deepStrictEqual(usages, []);
    });

    test('ignores extraction parameter expressions for qualified entity fields', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'v_ds_unpadapl = ds_unipadose.trec_receitem[$result + 1]',
                'v_ds_unpadapl = ds_unipadose.trec_receitem[variableInsideParameter + 1]',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(block, [
            'v_ds_unpadapl',
        ]);

        assert.deepStrictEqual(usages, []);
    });

    test('reports invalid numeric extraction parameters while validating the variable root', () => {
        const block: BlockCode = {
            text: '',
            startLine: 0,
            lines: [
                'entry sample',
                'result = vQtAplicacao[round,texto] + vQtAplicacao[fraction,2] + missingValue[round,2]',
                'end',
            ],
        };

        const usages = new UndeclaredVariableUsageAnalyzer().getUndeclaredUsages(
            block,
            ['result', 'vQtAplicacao'],
            [],
            [{ name: 'vQtAplicacao', dataType: 'numeric', line: 0 }]
        );

        assert.deepStrictEqual(
            usages.map((usage) => ({ name: usage.name, code: usage.diagnosticCode })),
            [
                { name: 'round,texto', code: 'uniface.invalidExtractionParameter' },
                { name: 'fraction,2', code: 'uniface.invalidExtractionParameter' },
                { name: 'missingValue', code: undefined },
                { name: 'round', code: undefined },
            ]
        );
    });
});

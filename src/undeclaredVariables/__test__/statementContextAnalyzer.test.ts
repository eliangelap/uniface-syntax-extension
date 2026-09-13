import * as assert from 'node:assert';
import { StatementContextAnalyzer } from '../statementContextAnalyzer';

suite('StatementContextAnalyzer', () => {
    test('masks selectdb projections across continuation lines', () => {
        const analyzer = new StatementContextAnalyzer(new Set(['selectdb', 'from']));

        const firstLine = analyzer.analyze('selectdb field_one %\\');
        const secondLine = analyzer.analyze('from "entity"');

        assert.doesNotMatch(firstLine.code, /field_one/);
        assert.match(secondLine.code, /from/);
    });

    test('marks callable names, including inline calls, and statement modifiers as ignored', () => {
        const analyzer = new StatementContextAnalyzer(new Set(['clear']));
        const callContext = analyzer.analyze('call process(value)');
        const inlineCallContext = analyzer.analyze('if (value = 1) call process(value)');
        const modifierContext = analyzer.analyze('clear/all value');

        assert.ok(callContext.ignoredTokenStarts.has(5));
        assert.ok(inlineCallContext.ignoredTokenStarts.has(20));
        assert.ok(modifierContext.ignoredTokenStarts.has(6));
    });

    test('marks direct entity arguments in configured procfunctions as ignored', () => {
        const analyzer = new StatementContextAnalyzer(new Set());
        const code =
            'if ($DBOCC ( pfat_cvvecto ) <= 0 | $curocc(outra_entidade) <= 0)';
        const context = analyzer.analyze(code);

        assert.ok(context.ignoredTokenStarts.has(code.indexOf('pfat_cvvecto')));
        assert.ok(context.ignoredTokenStarts.has(code.indexOf('outra_entidade')));
    });
});

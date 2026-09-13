import * as assert from 'node:assert';
import { GetStatementList } from '../getStatementList.use.case';

suite('GetStatementList', () => {
    test('returns a non-empty list without duplicate statements', () => {
        const statements = new GetStatementList().execute();
        const normalizedStatements = statements.map((statement) => statement.toLowerCase());

        assert.ok(statements.length > 0);
        assert.strictEqual(new Set(normalizedStatements).size, statements.length);
    });

    test('includes representative statements', () => {
        const statements = new GetStatementList().execute();

        for (const statement of ['call', 'if', 'return', 'to', 'while']) {
            assert.ok(statements.includes(statement));
        }
    });
});

import * as assert from 'node:assert';
import { GetStatementList } from '../getStatementList.use.case';

suite('GetStatementList', () => {
    test('returns a non-empty list without duplicate statements', () => {
        const statements = new GetStatementList().execute();
        const normalizedStatements = statements.map((statement) => statement.name.toLowerCase());

        assert.ok(statements.length > 0);
        assert.strictEqual(new Set(normalizedStatements).size, statements.length);
    });

    test('includes representative statements', () => {
        const statements = new GetStatementList().execute();

        for (const statement of ['call', 'if', 'return', 'to', 'while']) {
            assert.ok(statements.some((value) => value.name === statement));
        }
    });

    test('includes official documentation only when a source page exists', () => {
        const statements = new GetStatementList().execute();
        const activate = statements.find((statement) => statement.name === 'activate');
        const forStatement = statements.find((statement) => statement.name === 'for');

        assert.strictEqual(activate?.docs, 'Calls an operation on a component instance.');
        assert.ok(activate?.syntax?.startsWith('activate'));
        assert.ok(activate?.params.includes('String InstName'));
        assert.match(activate?.link ?? '', /^https:\/\/docs\.rocketsoftware\.com\/bundle\/uniface_104\/page\//);
        assert.deepStrictEqual(forStatement, { name: 'for', params: [] });

        for (const statement of statements) {
            assert.ok(!statement.link?.includes('/uniface2_104/'));
        }
    });

    test('does not expose XML declarations as statement syntax', () => {
        const statements = new GetStatementList().execute();

        for (const statement of statements) {
            assert.ok(!statement.syntax?.startsWith('<?xml'));
        }
    });

    test('preserves line breaks in multiline syntax examples', () => {
        const deleteInstance = new GetStatementList()
            .execute()
            .find((statement) => statement.name === 'deleteinstance');

        assert.match(deleteInstance?.syntax ?? '', /\n\s+newinstance /);
        assert.match(deleteInstance?.syntax ?? '', /\n\s+while \(\$status > 0\)/);
    });

    test('marks all statements deprecated by the official index', () => {
        const deprecatedStatements = new GetStatementList()
            .execute()
            .filter((statement) => statement.deprecated)
            .map((statement) => statement.name);

        assert.deepStrictEqual(deprecatedStatements, [
            'displaylength',
            'fieldsyntax',
            'fieldvideo',
            'length',
            'lowercase',
            'run',
            'scan',
            'uppercase',
        ]);
    });
});

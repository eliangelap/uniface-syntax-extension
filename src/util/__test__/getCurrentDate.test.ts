import * as assert from 'node:assert';
import { GetCurrentDate } from '../getCurrentDate.use.case';

suite('GetCurrentDate', () => {
    test('returns the current date in ISO format', () => {
        const date = new GetCurrentDate().execute();

        assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
        assert.strictEqual(date, new Date().toISOString().slice(0, 10));
    });
});

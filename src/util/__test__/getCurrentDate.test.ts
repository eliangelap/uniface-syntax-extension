import * as assert from 'node:assert';
import { GetCurrentDate } from '../getCurrentDate.use.case';

suite('GetCurrentDate', () => {
    test('returns the current date in ISO format', () => {
        const before = new Date().toISOString().slice(0, 10);
        const date = new GetCurrentDate().execute();
        const after = new Date().toISOString().slice(0, 10);

        assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
        assert.ok(date === before || date === after);
    });
});

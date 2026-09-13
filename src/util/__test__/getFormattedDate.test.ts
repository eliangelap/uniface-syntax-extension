import * as assert from 'node:assert';
import { GetFormattedDate } from '../getFormattedDate.use.case';

suite('GetFormattedDate', () => {
    test('formats ISO dates as day/month/year', () => {
        const formattedDate = new GetFormattedDate().execute('2026-07-22');

        assert.strictEqual(formattedDate, '22/07/2026');
    });

    test('preserves leading zeroes in dates', () => {
        const formattedDate = new GetFormattedDate().execute('2026-01-09');

        assert.strictEqual(formattedDate, '09/01/2026');
    });
});

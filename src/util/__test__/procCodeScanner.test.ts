import * as assert from 'node:assert';
import {
    getCodeOutsideStringsAndCommentsLines,
    isBlockdataLine,
} from '../procCodeScanner';

suite('ProcCodeScanner blockdata', () => {
    test('masks blockdata content until its matching delimiter', () => {
        const lines = [
            'dsTexto: blockdata+',
            'entry ignored',
            'end',
            '    +',
            'value = undeclaredValue',
        ];

        const codeLines = getCodeOutsideStringsAndCommentsLines(lines);

        assert.strictEqual(codeLines[0], 'dsTexto: '.padEnd(lines[0].length));
        assert.ok(codeLines.slice(1, 4).every((line) => line.trim() === ''));
        assert.strictEqual(codeLines[4], 'value = undeclaredValue');
        assert.strictEqual(isBlockdataLine(lines, 1), true);
        assert.strictEqual(isBlockdataLine(lines, 3), true);
        assert.strictEqual(isBlockdataLine(lines, 4), false);
    });

    test('keeps masking content when blockdata has no closing delimiter', () => {
        const lines = ['dsTexto: blockdata@', 'any text', 'entry ignored'];
        const codeLines = getCodeOutsideStringsAndCommentsLines(lines);

        assert.strictEqual(codeLines[0], 'dsTexto: '.padEnd(lines[0].length));
        assert.ok(codeLines.slice(1).every((line) => line.trim() === ''));
    });
});

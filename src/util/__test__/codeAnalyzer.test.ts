import * as assert from 'node:assert';
import { CodeAnalyzer } from '../codeAnalyzer.use.case';

suite('CodeAnalyzer', () => {
    test('identifies comments with optional leading whitespace', () => {
        assert.strictEqual(CodeAnalyzer.isLineCommented('; comment'), true);
        assert.strictEqual(CodeAnalyzer.isLineCommented('    ; comment'), true);
        assert.strictEqual(CodeAnalyzer.isLineCommented('\t; comment'), true);
    });

    test('does not treat code or inline comments as complete comment lines', () => {
        assert.strictEqual(CodeAnalyzer.isLineCommented('entry sampleEntry'), false);
        assert.strictEqual(CodeAnalyzer.isLineCommented('entry sampleEntry ; comment'), false);
        assert.strictEqual(CodeAnalyzer.isLineCommented(''), false);
    });
});

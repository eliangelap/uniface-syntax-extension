import * as assert from 'node:assert';
import { GetUnifaceProcFunctionList } from '../getUnifaceProcFunctionList.use.case';

suite('GetUnifaceProcFunctionList', () => {
    test('returns complete functions with unique names', () => {
        const functions = new GetUnifaceProcFunctionList().execute();
        const normalizedNames = functions.map((procFunction) => procFunction.name.toLowerCase());

        assert.ok(functions.length > 0);
        assert.strictEqual(new Set(normalizedNames).size, functions.length);

        for (const procFunction of functions) {
            assert.ok(procFunction.name.length > 0);
            assert.ok(Array.isArray(procFunction.params));
            assert.ok(procFunction.docs.length > 0);
        }
    });
});

import * as assert from 'node:assert';
import { GetUnifaceProcFunctionList } from '../getUnifaceProcFunctionList.use.case';

suite('GetUnifaceProcFunctionList', () => {
    test('returns complete functions with unique names', () => {
        const functions = new GetUnifaceProcFunctionList().execute();
        const normalizedNames = functions.map((procFunction) => procFunction.name.toLowerCase());

        assert.ok(functions.length > 0);
        assert.strictEqual(functions.length, 228);
        assert.strictEqual(new Set(normalizedNames).size, functions.length);

        for (const procFunction of functions) {
            assert.ok(procFunction.name.length > 0);
            assert.ok(Array.isArray(procFunction.params));
            assert.ok(procFunction.docs.length > 0);
            assert.match(procFunction.link, /^https:\/\/docs\.rocketsoftware\.com\/pt-BR\/bundle\/uniface_104\/page\/.+\.html$/);
        }
    });

    test('includes the Proc Functions added to the official index', () => {
        const functions = new GetUnifaceProcFunctionList().execute();
        const names = functions.map((procFunction) => procFunction.name.toLowerCase());

        assert.deepStrictEqual(
            ['$componentproperties', '$instanceproperties', '$random', '$regex'].map((name) =>
                names.includes(name)
            ),
            [true, true, true, true]
        );
    });

    test('marks the Proc Functions deprecated by the official index', () => {
        const functions = new GetUnifaceProcFunctionList().execute();
        const deprecatedNames = functions
            .filter((procFunction) => procFunction.deprecated)
            .map((procFunction) => procFunction.name)
            .sort();

        assert.deepStrictEqual(deprecatedNames, [
            '$formdb',
            '$formdbmod',
            '$formmod',
            '$formname',
            '$runmode',
        ]);
    });

    test('returns the official Rocket link for each Proc Function', () => {
        const functions = new GetUnifaceProcFunctionList().execute();
        const random = functions.find((procFunction) => procFunction.name === '$random');

        assert.strictEqual(
            random?.link,
            'https://docs.rocketsoftware.com/pt-BR/bundle/uniface_104/page/hqx1699858286844.html'
        );
    });

    test('uses the official Rocket synopsis in Proc Function documentation', () => {
        const functions = new GetUnifaceProcFunctionList().execute();
        const docsByName = new Map(functions.map((procFunction) => [procFunction.name, procFunction.docs]));

        assert.strictEqual(docsByName.get('$abs'), 'Return the absolute value of a numeric value.');
        assert.strictEqual(
            docsByName.get('$componentproperties'),
            'Return or set the definition-time widget properties of the current component instance.'
        );
        assert.strictEqual(
            docsByName.get('$random'),
            'Generate a random string, raw data of a specified length, or a number between 0 and 1.'
        );
    });
});

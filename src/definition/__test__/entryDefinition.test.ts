import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { UnifaceDefinitionProvider } from '../entryDefinition';

suite('UnifaceDefinitionProvider', () => {
    test('resolves an entry call regardless of casing', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry targetEntry\nend\nentry callerEntry\ncall TARGETENTRY\nend\n',
            language: 'uniface',
        });

        const definition = new UnifaceDefinitionProvider().provideDefinition(
            document,
            new vscode.Position(3, 9),
            new vscode.CancellationTokenSource().token
        ) as vscode.Location;

        assert.ok(definition);
        assert.strictEqual(definition.uri.toString(), document.uri.toString());
        assert.deepStrictEqual(definition.range.start, new vscode.Position(0, 0));
    });

    test('ignores calls in comments and unknown entries', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry targetEntry\nend\n; call targetEntry\ncall missingEntry\n',
            language: 'uniface',
        });
        const provider = new UnifaceDefinitionProvider();
        const cancellationToken = new vscode.CancellationTokenSource().token;

        const commentedDefinition = provider.provideDefinition(
            document,
            new vscode.Position(2, 9),
            cancellationToken
        );
        const unknownDefinition = provider.provideDefinition(
            document,
            new vscode.Position(3, 7),
            cancellationToken
        );

        assert.strictEqual(commentedDefinition, null);
        assert.strictEqual(unknownDefinition, null);
    });

    test('resolves the call under the cursor when a line has multiple calls', async () => {
        const document = await vscode.workspace.openTextDocument({
            content:
                'entry firstEntry\nend\nentry secondEntry\nend\ncall firstEntry call secondEntry\n',
            language: 'uniface',
        });

        const definition = new UnifaceDefinitionProvider().provideDefinition(
            document,
            new vscode.Position(4, 24),
            new vscode.CancellationTokenSource().token
        ) as vscode.Location;

        assert.ok(definition);
        assert.deepStrictEqual(definition.range.start, new vscode.Position(2, 0));
    });

    test('ignores calls in strings and keeps calls after semicolons in strings', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry targetEntry\nend\nmessage "call targetEntry"\nmessage ";" call targetEntry\n',
            language: 'uniface',
        });
        const provider = new UnifaceDefinitionProvider();
        const token = new vscode.CancellationTokenSource().token;

        assert.strictEqual(provider.provideDefinition(document, new vscode.Position(2, 18), token), null);
        assert.ok(provider.provideDefinition(document, new vscode.Position(3, 23), token));
    });
});

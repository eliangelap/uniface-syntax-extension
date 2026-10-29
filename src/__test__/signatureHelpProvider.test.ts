import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { UnifaceSignatureHelpProvider } from '../signatureHelpProvider';

suite('UnifaceSignatureHelpProvider', () => {
    test('finds function signatures regardless of casing', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '$curentproperties(',
            language: 'uniface',
        });
        const editor = await vscode.window.showTextDocument(document);
        const position = new vscode.Position(0, '$curentproperties('.length);
        editor.selection = new vscode.Selection(position, position);
        const cancellationTokenSource = new vscode.CancellationTokenSource();

        const signatureHelp = new UnifaceSignatureHelpProvider().provideSignatureHelp(
            document,
            position,
            cancellationTokenSource.token,
            {} as vscode.SignatureHelpContext
        ) as vscode.SignatureHelp;

        cancellationTokenSource.dispose();

        assert.ok(signatureHelp);
        assert.strictEqual(
            signatureHelp.signatures[0].label,
            '$CurEntProperties(string Entity, string Properties (optional))'
        );
        assert.ok(signatureHelp.signatures[0].documentation);
    });

    test('displays deprecation and official documentation link for deprecated Proc Functions', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '$formdb(',
            language: 'uniface',
        });
        const editor = await vscode.window.showTextDocument(document);
        const position = new vscode.Position(0, '$formdb('.length);
        editor.selection = new vscode.Selection(position, position);
        const cancellationTokenSource = new vscode.CancellationTokenSource();

        const signatureHelp = new UnifaceSignatureHelpProvider().provideSignatureHelp(
            document,
            position,
            cancellationTokenSource.token,
            {} as vscode.SignatureHelpContext
        ) as vscode.SignatureHelp;

        cancellationTokenSource.dispose();

        const documentation = signatureHelp.signatures[0].documentation as vscode.MarkdownString;
        assert.match(documentation.value, /\*\*Deprecated\.\*\*/);
        assert.match(
            documentation.value,
            /https:\/\/docs\.rocketsoftware\.com\/pt-BR\/bundle\/uniface_104\/page\/anh1665702601480\.html/
        );
    });

    test('returns no signature when the cursor is outside a supported call expression', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'value = 1',
            language: 'uniface',
        });
        const editor = await vscode.window.showTextDocument(document);
        const position = new vscode.Position(0, document.lineAt(0).text.length);
        editor.selection = new vscode.Selection(position, position);
        const cancellationTokenSource = new vscode.CancellationTokenSource();

        const signatureHelp = new UnifaceSignatureHelpProvider().provideSignatureHelp(
            document,
            position,
            cancellationTokenSource.token,
            {} as vscode.SignatureHelpContext
        );

        cancellationTokenSource.dispose();

        assert.strictEqual(signatureHelp, null);
    });

    test('returns entry parameters and selects the active argument', async () => {
        const content = [
            'entry calculate',
            'params',
            '    string input : in',
            '    numeric total : out',
            'endparams',
            'end',
            'call calculate(first, second',
        ].join('\n');
        const document = await vscode.workspace.openTextDocument({ content, language: 'uniface' });
        const editor = await vscode.window.showTextDocument(document);
        const position = new vscode.Position(6, 'call calculate(first, second'.length);
        editor.selection = new vscode.Selection(position, position);
        const cancellationTokenSource = new vscode.CancellationTokenSource();

        const signatureHelp = new UnifaceSignatureHelpProvider().provideSignatureHelp(
            document,
            position,
            cancellationTokenSource.token,
            {} as vscode.SignatureHelpContext
        ) as vscode.SignatureHelp;

        cancellationTokenSource.dispose();

        assert.strictEqual(signatureHelp.signatures[0].label, 'calculate(input, total)');
        assert.strictEqual(signatureHelp.signatures[0].documentation, '');
        assert.deepStrictEqual(
            signatureHelp.signatures[0].parameters.map((parameter) => parameter.label),
            ['input', 'total']
        );
        assert.strictEqual(signatureHelp.activeParameter, 1);
    });

    test('keeps the generic signature for an unknown Proc Function', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '$unknown(',
            language: 'uniface',
        });
        const editor = await vscode.window.showTextDocument(document);
        const position = new vscode.Position(0, '$unknown('.length);
        editor.selection = new vscode.Selection(position, position);
        const cancellationTokenSource = new vscode.CancellationTokenSource();

        const signatureHelp = new UnifaceSignatureHelpProvider().provideSignatureHelp(
            document,
            position,
            cancellationTokenSource.token,
            {} as vscode.SignatureHelpContext
        ) as vscode.SignatureHelp;

        cancellationTokenSource.dispose();

        assert.strictEqual(signatureHelp.signatures[0].label, '$unknown()');
        assert.strictEqual(signatureHelp.signatures[0].documentation, undefined);
    });

    test('shows statement syntax and official documentation after a space', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'activate ',
            language: 'uniface',
        });
        const editor = await vscode.window.showTextDocument(document);
        const position = new vscode.Position(0, 'activate '.length);
        editor.selection = new vscode.Selection(position, position);
        const cancellationTokenSource = new vscode.CancellationTokenSource();

        const signatureHelp = new UnifaceSignatureHelpProvider().provideSignatureHelp(
            document,
            position,
            cancellationTokenSource.token,
            {} as vscode.SignatureHelpContext
        ) as vscode.SignatureHelp;

        cancellationTokenSource.dispose();

        assert.ok(signatureHelp.signatures[0].label.startsWith('activate'));
        const documentation = signatureHelp.signatures[0].documentation as vscode.MarkdownString;
        assert.match(documentation.value, /Calls an operation on a component instance\./);
        assert.match(documentation.value, /Official documentation/);
    });
});

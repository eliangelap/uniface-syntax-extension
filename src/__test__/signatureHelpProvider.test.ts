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
});

import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Uniface CompletionItemProvider Test', () => {
    test('Should suggest parameters from entry when using call', async () => {
        const sampleCode = `
entry minhaEntry
params
    param1 : in
    param2 : out
endparams
end

call minhaEntry
        `;

        const doc = await vscode.workspace.openTextDocument({
            content: sampleCode,
            language: 'uniface',
        });

        // Posiciona o cursor logo após "call minhaEntry"
        const callLine = doc.lineAt(doc.lineCount - 1);
        const position = new vscode.Position(
            callLine.lineNumber,
            callLine.text.length
        );

        const completions =
            await vscode.commands.executeCommand<vscode.CompletionList>(
                'vscode.executeCompletionItemProvider',
                doc.uri,
                position
            );

        const labels = completions?.items.map((item) => item.label);

        assert.ok(
            labels?.includes('param1'),
            'param1 deve estar presente nas sugestões'
        );
        assert.ok(
            labels?.includes('param2'),
            'param2 deve estar presente nas sugestões'
        );
    });
});

import * as vscode from 'vscode';

const goldSequences: Record<string, string> = {
    '+;': '\x1B',
    '+=': '\x12',
    '+!': '\x15',
    '+<': '\x14',
    '+>': '\x13',
    '+&': '\x16',
    '+|': '\x17',
    '+?': '\x11',
};

export function registerGoldInterceptor(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((event) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || event.document !== editor.document) return;

            const change = event.contentChanges[0];
            if (!change || change.text.length !== 1) return;

            const cursor = change.range.start;
            const lineText = editor.document.lineAt(cursor.line).text;

            const lineUpToCursor = lineText.slice(0, cursor.character + 1);

            for (const [combo, asciiChar] of Object.entries(goldSequences)) {
                if (lineUpToCursor.endsWith(combo)) {
                    const startPos = new vscode.Position(
                        cursor.line,
                        cursor.character - (combo.length - 1)
                    );
                    const endPos = cursor.translate(0, 1);
                    const range = new vscode.Range(startPos, endPos);

                    editor.edit((editBuilder) => {
                        editBuilder.replace(range, asciiChar);
                    });

                    break;
                }
            }
        })
    );
}


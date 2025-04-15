import * as vscode from 'vscode';

const goldCharacters: Record<number, { display: string }> = {
    27: { display: ';' },
    18: { display: '=' },
    21: { display: '!' },
    20: { display: '<' },
    19: { display: '>' },
    22: { display: '&' },
    23: { display: '|' },
    17: { display: '?' },
};

let goldDecorations: Map<number, vscode.TextEditorDecorationType>;

export function initGoldDecorator() {
    goldDecorations = new Map();

    for (const [ascii, { display }] of Object.entries(goldCharacters)) {
        const decoration = vscode.window.createTextEditorDecorationType({
            before: {
                contentText: display,
                color: 'black',
                backgroundColor: 'orange',
                fontWeight: 'bold',
                margin: '0 1px',
            },
            backgroundColor: 'orange',
            textDecoration: 'none; display: none;',
        });

        goldDecorations.set(Number(ascii), decoration);
    }
}

export function updateGoldDecorations(editor: vscode.TextEditor) {
    const text = editor.document.getText();

    for (const [ascii, decoration] of goldDecorations.entries()) {
        const decorations: vscode.DecorationOptions[] = [];

        for (let i = 0; i < text.length; i++) {
            if (text.charCodeAt(i) === ascii) {
                const pos = editor.document.positionAt(i);
                const range = new vscode.Range(pos, pos.translate(0, 1));
                decorations.push({
                    range,
                    hoverMessage: `Caractere ASCII ${ascii}`,
                });
            }
        }

        editor.setDecorations(decoration, decorations);
    }
}

export function registerGoldDecorationEvents(context: vscode.ExtensionContext) {
    const update = (editor?: vscode.TextEditor) => {
        if (editor) {
            updateGoldDecorations(editor);
        }
    };

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(update),
        vscode.workspace.onDidChangeTextDocument((e) => {
            const editor = vscode.window.activeTextEditor;
            if (editor && e.document === editor.document) {
                update(editor);
            }
        }),
        vscode.workspace.onDidOpenTextDocument((doc) => {
            const editor = vscode.window.visibleTextEditors.find(
                (e) => e.document === doc
            );
            if (editor) {
                update(editor);
            }
        })
    );
}

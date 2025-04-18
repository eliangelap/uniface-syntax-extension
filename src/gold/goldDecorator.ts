import * as vscode from 'vscode';

interface GoldCharacter {
    ascii: number;
    display: string;
}

class GoldCharacterRegistry {
    private characters: GoldCharacter[] = [
        { ascii: 27, display: ';' },
        { ascii: 18, display: '=' },
        { ascii: 21, display: '!' },
        { ascii: 20, display: '<' },
        { ascii: 19, display: '>' },
        { ascii: 22, display: '&' },
        { ascii: 23, display: '|' },
        { ascii: 17, display: '?' },
    ];

    private decorations: Map<number, vscode.TextEditorDecorationType> =
        new Map();

    constructor() {
        this.initializeDecorations();
    }

    private initializeDecorations() {
        for (const { ascii, display } of this.characters) {
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

            this.decorations.set(ascii, decoration);
        }
    }

    public getDecoration(
        ascii: number
    ): vscode.TextEditorDecorationType | undefined {
        return this.decorations.get(ascii);
    }

    public getAllAsciiCodes(): number[] {
        return Array.from(this.decorations.keys());
    }
}

class GoldDecorator {
    constructor(private readonly registry: GoldCharacterRegistry) {}

    public apply(editor: vscode.TextEditor): void {
        const text = editor.document.getText();

        for (const ascii of this.registry.getAllAsciiCodes()) {
            const decoration = this.registry.getDecoration(ascii);
            if (!decoration) {
                continue;
            }

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
}

export function registerGoldDecorationEvents(context: vscode.ExtensionContext) {
    const registry = new GoldCharacterRegistry();
    const decorator = new GoldDecorator(registry);

    const updateEditor = (editor?: vscode.TextEditor) => {
        if (editor) {
            decorator.apply(editor);
        }
    };

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(updateEditor),
        vscode.workspace.onDidChangeTextDocument((e) => {
            const editor = vscode.window.activeTextEditor;
            if (editor && e.document === editor.document) {
                updateEditor(editor);
            }
        }),
        vscode.workspace.onDidOpenTextDocument((doc) => {
            const editor = vscode.window.visibleTextEditors.find(
                (e) => e.document === doc
            );
            if (editor) {
                updateEditor(editor);
            }
        })
    );

    updateEditor(vscode.window.activeTextEditor);
}

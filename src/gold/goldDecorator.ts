import * as vscode from 'vscode';

interface GoldCharacter {
    ascii: number;
    display: string;
}

export function createGoldDecorationOptions(display: string): vscode.DecorationRenderOptions {
    return {
        before: {
            contentText: display,
            color: 'black',
            backgroundColor: 'orange',
            fontWeight: 'bold',
            margin: '0 1px',
        },
        backgroundColor: 'orange',
        textDecoration: 'none; display: none;',
    };
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
        { ascii: 16, display: '*' },
    ];

    private readonly decorations = new Map<number, vscode.TextEditorDecorationType>();

    constructor() {
        this.initializeDecorations();
    }

    private initializeDecorations() {
        for (const { ascii, display } of this.characters) {
            const decoration = vscode.window.createTextEditorDecorationType(
                createGoldDecorationOptions(display)
            );

            this.decorations.set(ascii, decoration);
        }
    }

    public getDecoration(ascii: number): vscode.TextEditorDecorationType | undefined {
        return this.decorations.get(ascii);
    }

    public getAllAsciiCodes(): number[] {
        return Array.from(this.decorations.keys());
    }

    public getAllDecorations(): vscode.TextEditorDecorationType[] {
        return Array.from(this.decorations.values());
    }
}

export function isUnifaceDocument(document: vscode.TextDocument): boolean {
    return document.languageId === 'uniface';
}

export function getGoldCharacterRanges(
    document: vscode.TextDocument,
    asciiCodes: number[]
): Map<number, vscode.DecorationOptions[]> {
    const decorationsByAscii = new Map<number, vscode.DecorationOptions[]>();
    const supportedAsciiCodes = new Set(asciiCodes);

    for (const ascii of asciiCodes) {
        decorationsByAscii.set(ascii, []);
    }

    const text = document.getText();
    for (let i = 0; i < text.length; i++) {
        const ascii = text.charCodeAt(i);
        if (!supportedAsciiCodes.has(ascii)) {
            continue;
        }

        const pos = document.positionAt(i);
        decorationsByAscii.get(ascii)?.push({
            range: new vscode.Range(pos, pos.translate(0, 1)),
            hoverMessage: `Caractere ASCII ${ascii}`,
        });
    }

    return decorationsByAscii;
}

class GoldDecorator {
    constructor(private readonly registry: GoldCharacterRegistry) {}

    public apply(editor: vscode.TextEditor): void {
        if (!isUnifaceDocument(editor.document)) {
            return;
        }

        const decorationsByAscii = getGoldCharacterRanges(
            editor.document,
            this.registry.getAllAsciiCodes()
        );

        for (const ascii of this.registry.getAllAsciiCodes()) {
            const decoration = this.registry.getDecoration(ascii);
            if (!decoration) {
                continue;
            }

            editor.setDecorations(decoration, decorationsByAscii.get(ascii) ?? []);
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
        ...registry.getAllDecorations(),
        vscode.window.onDidChangeActiveTextEditor(updateEditor),
        vscode.workspace.onDidChangeTextDocument((e) => {
            const editor = vscode.window.activeTextEditor;
            if (editor && e.document === editor.document) {
                updateEditor(editor);
            }
        }),
        vscode.workspace.onDidOpenTextDocument((doc) => {
            const editor = vscode.window.visibleTextEditors.find((e) => e.document === doc);
            if (editor) {
                updateEditor(editor);
            }
        })
    );

    updateEditor(vscode.window.activeTextEditor);
}

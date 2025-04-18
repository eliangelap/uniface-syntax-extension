import * as vscode from 'vscode';

class FunctionNode extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly line: number) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.command = {
            command: 'uniface.navigateToFunction',
            title: 'Go to Function',
            arguments: [line],
        };
    }
}

class FunctionTreeProvider
    implements vscode.TreeDataProvider<FunctionNode>
{
    private _onDidChangeTreeData: vscode.EventEmitter<
        FunctionNode | undefined | null
    > = new vscode.EventEmitter();
    readonly onDidChangeTreeData: vscode.Event<
        FunctionNode | undefined | null
    > = this._onDidChangeTreeData.event;

    private list: FunctionNode[] = [];
    private functions: FunctionNode[] = [];
    private operations: FunctionNode[] = [];
    private triggers: FunctionNode[] = [];
    private entries: FunctionNode[] = [];

    refresh(document: vscode.TextDocument) {
        const text = document.getText().trim();
        const regex = /\b(entry|operation|function|trigger)\s+(\w+)/gi;

        this.list = [];
        this.functions = [];
        this.operations = [];
        this.entries = [];
        this.triggers = [];

        const validKeywords = ['entry', 'operation', 'function', 'trigger'];

        for (const match of text.matchAll(regex)) {
            const line = document.positionAt(match.index || 0).line;
            const lineText = document.lineAt(line).text.trim();

            if (
                !validKeywords.some((keyword) => lineText.startsWith(keyword))
            ) {
                continue;
            }

            const label = `${match[1]} ${match[2]}`;

            switch (match[1].toLowerCase()) {
                case 'operation':
                    this.operations.push(new FunctionNode(label, line));
                    break;
                case 'trigger':
                    this.triggers.push(new FunctionNode(label, line));
                    break;
                case 'function':
                    this.functions.push(new FunctionNode(label, line));
                    break;
                case 'entry':
                default:
                    this.entries.push(new FunctionNode(label, line));
                    break;
            }
        }

        const sortFunction = function (a: FunctionNode, b: FunctionNode) {
            return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1;
        };

        this.functions.sort(sortFunction);
        this.entries.sort(sortFunction);
        this.operations.sort(sortFunction);
        this.triggers.sort(sortFunction);

        this.list.push(...this.triggers);
        this.list.push(...this.operations);
        this.list.push(...this.entries);
        this.list.push(...this.functions);

        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: FunctionNode): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<FunctionNode[]> {
        return Promise.resolve(this.list);
    }
}

export function registerTreeDataProvider(context: vscode.ExtensionContext) {
    const functionTreeProvider = new FunctionTreeProvider();
    const treeView = vscode.window.createTreeView('unifaceFunctions', {
        treeDataProvider: functionTreeProvider,
    });

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'uniface.navigateToFunction',
            (line: number) => {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const position = new vscode.Position(line, 0);
                    editor.selection = new vscode.Selection(position, position);
                    editor.revealRange(new vscode.Range(position, position));
                }
            }
        )
    );

    vscode.workspace.onDidOpenTextDocument((doc) => {
        if (doc.languageId === 'uniface') {
            functionTreeProvider.refresh(doc);
        }
    });

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.languageId === 'uniface') {
            functionTreeProvider.refresh(editor.document);
        }
    });

    vscode.workspace.onDidChangeTextDocument((e) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && e.document === editor.document) {
            functionTreeProvider.refresh(editor.document);
        }
    });

    if (vscode.window.activeTextEditor) {
        functionTreeProvider.refresh(vscode.window.activeTextEditor.document);
    }

    context.subscriptions.push(treeView);
}
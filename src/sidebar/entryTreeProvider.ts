import * as vscode from "vscode";
import { GetDeclaredModulesList } from "../code/getDeclaredModulesList.use.case";

class FunctionNode extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly line: number) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.command = {
            command: "uniface.navigateToFunction",
            title: "Go to Function",
            arguments: [line],
        };
    }
}

class FunctionTreeProvider implements vscode.TreeDataProvider<FunctionNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<
        FunctionNode | undefined | null
    > = new vscode.EventEmitter();
    readonly onDidChangeTreeData: vscode.Event<
        FunctionNode | undefined | null
    > = this._onDidChangeTreeData.event;

    private list: FunctionNode[] = [];

    refresh(document: vscode.TextDocument) {
        const declaredModules = new GetDeclaredModulesList().execute(document);

        for (const module of declaredModules) {
            this.list.push(
                new FunctionNode(
                    `${module.scriptModuleType} ${module.name}`,
                    module.line
                )
            );
        }

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
    const treeView = vscode.window.createTreeView("unifaceFunctions", {
        treeDataProvider: functionTreeProvider,
    });

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "uniface.navigateToFunction",
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
        if (doc.languageId === "uniface") {
            functionTreeProvider.refresh(doc);
        }
    });

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.languageId === "uniface") {
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

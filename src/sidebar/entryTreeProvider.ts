import * as vscode from 'vscode';
import { GetDeclaredModulesList } from '../code/getDeclaredModulesList.use.case';
import { DeclaredModule } from '../code/types/declaredModule';
import { DocumentAnalysisSnapshot } from '../util/documentAnalysisSnapshot';

class FunctionNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly line: number,
        navigationCommand: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.command = {
            command: navigationCommand,
            title: 'Go to Function',
            arguments: [line],
        };
    }
}

class FunctionTreeProvider implements vscode.TreeDataProvider<FunctionNode> {
    private readonly _onDidChangeTreeData: vscode.EventEmitter<FunctionNode | undefined | null> =
        new vscode.EventEmitter();
    readonly onDidChangeTreeData: vscode.Event<FunctionNode | undefined | null> =
        this._onDidChangeTreeData.event;

    private list: FunctionNode[] = [];

    constructor(private readonly navigationCommand: string) {}

    refresh(document: vscode.TextDocument) {
        this.refreshModules(new GetDeclaredModulesList().execute(document));
    }

    refreshSnapshot(snapshot: DocumentAnalysisSnapshot) {
        this.refreshModules(snapshot.modules);
    }

    dispose() {
        this._onDidChangeTreeData.dispose();
    }

    private refreshModules(declaredModules: DeclaredModule[]) {
        this.list = [];

        for (const module of declaredModules) {
            this.list.push(
                new FunctionNode(
                    `${module.scriptModuleType} ${module.name}`,
                    module.line,
                    this.navigationCommand
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

export interface EntryTreeController extends vscode.Disposable {
    refreshSnapshot(snapshot: DocumentAnalysisSnapshot): void;
}

export function registerTreeDataProvider(
    context: vscode.ExtensionContext,
    navigationCommand = 'uniface.navigateToFunction'
): EntryTreeController {
    const functionTreeProvider = new FunctionTreeProvider(navigationCommand);
    const treeView = vscode.window.createTreeView('unifaceFunctions', {
        treeDataProvider: functionTreeProvider,
    });

    context.subscriptions.push(
        vscode.commands.registerCommand(navigationCommand, (line: number) => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const position = new vscode.Position(line, 0);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(new vscode.Range(position, position));
            }
        }),
        vscode.workspace.onDidOpenTextDocument((doc) => {
            if (doc.languageId === 'uniface') {
                functionTreeProvider.refresh(doc);
            }
        }),
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor?.document.languageId === 'uniface') {
                functionTreeProvider.refresh(editor.document);
            }
        }),
        functionTreeProvider
    );

    if (vscode.window.activeTextEditor) {
        functionTreeProvider.refresh(vscode.window.activeTextEditor.document);
    }

    context.subscriptions.push(treeView);

    return {
        refreshSnapshot: (snapshot) => {
            if (snapshot.document === vscode.window.activeTextEditor?.document) {
                functionTreeProvider.refreshSnapshot(snapshot);
            }
        },
        dispose: () => functionTreeProvider.dispose(),
    };
}

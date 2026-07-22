import * as vscode from 'vscode';
import { BlockCode, GetBlockAroundPosition } from '../code/getBlockAroundPosition.use.case';
import { DeclaredVariable, GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import {
    UnusedVariablesDiagnosticPublisher,
    UnusedVariablesDiagnosticPublisherContract,
} from './unusedVariablesDiagnosticPublisher';
import { VariableUsageAnalyzer } from './variableUsageAnalyzer';

interface UnusedVariableAnalyzerDependencies {
    getActiveTextEditor(): vscode.TextEditor | undefined;
    getBlock(document: vscode.TextDocument, position: vscode.Position): BlockCode | null;
    getVariables(block: BlockCode): DeclaredVariable[];
}

const defaultDependencies: UnusedVariableAnalyzerDependencies = {
    getActiveTextEditor: () => vscode.window.activeTextEditor,
    getBlock: (document, position) => new GetBlockAroundPosition().execute(document, position),
    getVariables: (block) => new GetVariablesFromBlock().execute(block),
};

export class UnifaceUnusedVariableAnalyzer implements vscode.Disposable {
    constructor(
        private readonly publisher: UnusedVariablesDiagnosticPublisherContract =
            new UnusedVariablesDiagnosticPublisher(),
        private readonly usageAnalyzer = new VariableUsageAnalyzer(),
        private readonly dependencies: UnusedVariableAnalyzerDependencies = defaultDependencies
    ) {}

    public analyzeDocument(document: vscode.TextDocument): void {
        const editor = this.dependencies.getActiveTextEditor();
        if (document.languageId !== 'uniface' || editor?.document !== document) {
            this.publisher.clear(document);
            return;
        }

        const block = this.dependencies.getBlock(document, editor.selection.active);
        if (!block) {
            this.publisher.clear(document);
            return;
        }

        const declaredVariables = this.dependencies.getVariables(block);
        const usedVariables = this.usageAnalyzer.getUsedVariables(block.lines, declaredVariables);
        const unusedVariables = declaredVariables.filter(
            (variable) => !usedVariables.has(variable.name)
        );

        this.publisher.publish(document, unusedVariables);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.publisher.clear(document);
    }

    public dispose(): void {
        this.publisher.dispose();
    }
}

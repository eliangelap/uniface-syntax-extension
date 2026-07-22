import * as vscode from 'vscode';
import { BlockCode, GetBlockAroundPosition } from '../code/getBlockAroundPosition.use.case';
import { GetParametersFromBlock } from '../code/getParametersFromBlock.use.case';
import { DeclaredVariable, GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import {
    UndeclaredVariablesDiagnosticPublisher,
    UndeclaredVariablesDiagnosticPublisherContract,
} from './undeclaredVariablesDiagnosticPublisher';
import { UndeclaredVariableUsageAnalyzer } from './undeclaredVariableUsageAnalyzer';

interface UndeclaredVariableAnalyzerDependencies {
    getActiveTextEditor(): vscode.TextEditor | undefined;
    getBlock(document: vscode.TextDocument, position: vscode.Position): BlockCode | null;
    getVariables(block: BlockCode): DeclaredVariable[];
    getParameters(block: BlockCode): DeclaredVariable[];
}

const defaultDependencies: UndeclaredVariableAnalyzerDependencies = {
    getActiveTextEditor: () => vscode.window.activeTextEditor,
    getBlock: (document, position) => new GetBlockAroundPosition().execute(document, position),
    getVariables: (block) => new GetVariablesFromBlock().execute(block),
    getParameters: (block) => new GetParametersFromBlock().execute(block),
};

export class UndeclaredVariableAnalyzer implements vscode.Disposable {
    constructor(
        private readonly publisher: UndeclaredVariablesDiagnosticPublisherContract =
            new UndeclaredVariablesDiagnosticPublisher(),
        private readonly usageAnalyzer = new UndeclaredVariableUsageAnalyzer(),
        private readonly dependencies: UndeclaredVariableAnalyzerDependencies = defaultDependencies
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

        const declaredNames = [
            ...this.dependencies.getVariables(block),
            ...this.dependencies.getParameters(block),
        ].map((variable) => variable.name);
        const usages = this.usageAnalyzer.getUndeclaredUsages(block, declaredNames);

        this.publisher.publish(document, usages);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.publisher.clear(document);
    }

    public dispose(): void {
        this.publisher.dispose();
    }
}

import * as vscode from 'vscode';
import { BlockCode } from '../code/getBlockAroundPosition.use.case';
import { GetBlockList } from '../code/getBlockList.use.case';
import { DeclaredVariable, GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import {
    UnusedVariablesDiagnosticPublisher,
    UnusedVariablesDiagnosticPublisherContract,
} from './unusedVariablesDiagnosticPublisher';
import { VariableUsageAnalyzer } from './variableUsageAnalyzer';

interface UnusedVariableAnalyzerDependencies {
    getBlocks(document: vscode.TextDocument): BlockCode[];
    getVariables(block: BlockCode): DeclaredVariable[];
}

const defaultDependencies: UnusedVariableAnalyzerDependencies = {
    getBlocks: (document) => new GetBlockList().execute(document),
    getVariables: (block) => new GetVariablesFromBlock().execute(block),
};

export class UnifaceUnusedVariableAnalyzer implements vscode.Disposable {
    constructor(
        private readonly publisher: UnusedVariablesDiagnosticPublisherContract = new UnusedVariablesDiagnosticPublisher(),
        private readonly usageAnalyzer = new VariableUsageAnalyzer(),
        private readonly dependencies: UnusedVariableAnalyzerDependencies = defaultDependencies
    ) {}

    public analyzeDocument(document: vscode.TextDocument): void {
        if (document.languageId !== 'uniface') {
            this.publisher.clear(document);
            return;
        }

        const blocks = this.dependencies.getBlocks(document);
        if (blocks.length === 0) {
            this.publisher.clear(document);
            return;
        }

        const unusedVariables = blocks.flatMap((block) => {
            const declaredVariables = this.dependencies.getVariables(block);
            const usedVariables = this.usageAnalyzer.getUsedVariables(block.lines, declaredVariables);

            return declaredVariables.filter((variable) => !usedVariables.has(variable.name));
        });

        this.publisher.publish(document, unusedVariables);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.publisher.clear(document);
    }

    public dispose(): void {
        this.publisher.dispose();
    }
}

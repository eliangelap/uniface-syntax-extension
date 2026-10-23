import * as vscode from 'vscode';
import { BlockCode } from '../code/getBlockAroundPosition.use.case';
import { GetBlockList } from '../code/getBlockList.use.case';
import { findMissingBlockEnds } from '../blockStructure/blockStructureAnalyzer';
import { GetParametersFromBlock } from '../code/getParametersFromBlock.use.case';
import { DeclaredVariable, GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import {
    UndeclaredVariablesDiagnosticPublisher,
    UndeclaredVariablesDiagnosticPublisherContract,
} from './undeclaredVariablesDiagnosticPublisher';
import { UndeclaredVariableUsageAnalyzer } from './undeclaredVariableUsageAnalyzer';
import { DocumentAnalysisSnapshot } from '../util/documentAnalysisSnapshot';

interface UndeclaredVariableAnalyzerDependencies {
    getBlocks(document: vscode.TextDocument): BlockCode[];
    getVariables(block: BlockCode): DeclaredVariable[];
    getParameters(block: BlockCode): DeclaredVariable[];
}

const defaultDependencies: UndeclaredVariableAnalyzerDependencies = {
    getBlocks: (document) => new GetBlockList().execute(document),
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
        if (
            document.languageId !== 'uniface' ||
            findMissingBlockEnds(document.getText().split(/\r?\n/)).length > 0
        ) {
            this.publisher.clear(document);
            return;
        }

        const blocks = this.dependencies.getBlocks(document);
        if (blocks.length === 0) {
            this.publisher.clear(document);
            return;
        }

        const usages = blocks.flatMap((block) => {
            const declaredVariables = [
                ...this.dependencies.getVariables(block),
                ...this.dependencies.getParameters(block),
            ];
            const declaredNames = declaredVariables.map((variable) => variable.name);

            return this.usageAnalyzer.getUndeclaredUsages(
                block,
                declaredNames,
                declaredVariables
            );
        });

        this.publisher.publish(document, usages);
    }

    public analyzeSnapshot(snapshot: DocumentAnalysisSnapshot): void {
        const { document, blocks, missingBlockEnds } = snapshot;
        if (document.languageId !== 'uniface' || missingBlockEnds.length > 0 || blocks.length === 0) {
            this.publisher.clear(document);
            return;
        }

        const usages = blocks.flatMap((block) => {
            const declaredVariables = [...block.variables, ...block.parameters];
            return this.usageAnalyzer.getUndeclaredUsages(
                block,
                declaredVariables.map((variable) => variable.name),
                declaredVariables
            );
        });

        this.publisher.publish(document, usages);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.publisher.clear(document);
    }

    public dispose(): void {
        this.publisher.dispose();
    }
}

import * as vscode from 'vscode';
import { BlockCode } from '../code/getBlockAroundPosition.use.case';
import { GetBlockList } from '../code/getBlockList.use.case';
import { findMissingBlockEnds } from '../blockStructure/blockStructureAnalyzer';
import { DeclaredVariable, GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import { DeclaredParameter, GetParametersFromBlock } from '../code/getParametersFromBlock.use.case';
import {
    UnusedVariablesDiagnosticPublisher,
    UnusedVariablesDiagnosticPublisherContract,
    uninitializedVariableDiagnosticCode,
    unusedVariableDiagnosticCode,
    VariableDiagnostic,
} from './unusedVariablesDiagnosticPublisher';
import { CallableSignatures, VariableUsageAnalyzer } from './variableUsageAnalyzer';
import { DocumentAnalysisSnapshot } from '../util/documentAnalysisSnapshot';

interface UnusedVariableAnalyzerDependencies {
    getBlocks(document: vscode.TextDocument): BlockCode[];
    getVariables(block: BlockCode): DeclaredVariable[];
    getParameters?(block: BlockCode): DeclaredParameter[];
}

const defaultDependencies: UnusedVariableAnalyzerDependencies = {
    getBlocks: (document) => new GetBlockList().execute(document),
    getVariables: (block) => new GetVariablesFromBlock().execute(block),
    getParameters: (block) => new GetParametersFromBlock().execute(block),
};

export class UnifaceUnusedVariableAnalyzer implements vscode.Disposable {
    constructor(
        private readonly publisher: UnusedVariablesDiagnosticPublisherContract = new UnusedVariablesDiagnosticPublisher(),
        private readonly usageAnalyzer = new VariableUsageAnalyzer(),
        private readonly dependencies: UnusedVariableAnalyzerDependencies = defaultDependencies
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

        const analyzedBlocks = blocks.map((block) => ({
            ...block,
            variables: this.dependencies.getVariables(block),
            parameters: this.dependencies.getParameters?.(block) ?? [],
        }));
        const callableSignatures = this.usageAnalyzer.getCallableSignatures(analyzedBlocks);
        const diagnostics = analyzedBlocks.flatMap((block) =>
            this.getDiagnostics(block, block.variables, callableSignatures)
        );

        this.publisher.publish(document, diagnostics);
    }

    public analyzeSnapshot(snapshot: DocumentAnalysisSnapshot): void {
        const { document, blocks, missingBlockEnds } = snapshot;
        if (document.languageId !== 'uniface' || missingBlockEnds.length > 0 || blocks.length === 0) {
            this.publisher.clear(document);
            return;
        }

        const callableSignatures = this.usageAnalyzer.getCallableSignatures(blocks);
        const diagnostics = blocks.flatMap((block) =>
            this.getDiagnostics(block, block.variables, callableSignatures)
        );

        this.publisher.publish(document, diagnostics);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.publisher.clear(document);
    }

    public dispose(): void {
        this.publisher.dispose();
    }

    private getDiagnostics(
        block: BlockCode,
        declaredVariables: DeclaredVariable[],
        callableSignatures: CallableSignatures
    ): VariableDiagnostic[] {
        const usage = this.usageAnalyzer.getUsageSummary(block.lines, declaredVariables, callableSignatures);
        const unusedDiagnostics = declaredVariables
            .filter((variable) => !usage.readVariables.has(variable.name))
            .map((variable) => ({
                variable,
                code: unusedVariableDiagnosticCode,
                message: `Variable "${variable.name}" is declared but is not used.`,
            }));
        const uninitializedDiagnostics = usage.uninitializedReads.map((read) => {
            const variable = declaredVariables.find(
                (declaredVariable) => declaredVariable.name === read.name
            );

            if (!variable) {
                throw new Error(`Declared variable "${read.name}" was not found.`);
            }

            return {
                variable,
                code: uninitializedVariableDiagnosticCode,
                message: usage.initializedVariables.has(read.name)
                    ? `Variable "${variable.name}" is used before it is initialized.`
                    : `Variable "${variable.name}" is used but was never initialized.`,
                range: new vscode.Range(
                    block.startLine + read.line,
                    read.start,
                    block.startLine + read.line,
                    read.start + read.name.length
                ),
            };
        });

        return [...unusedDiagnostics, ...uninitializedDiagnostics];
    }
}

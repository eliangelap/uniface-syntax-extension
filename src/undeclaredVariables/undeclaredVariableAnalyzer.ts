import * as vscode from 'vscode';
import { BlockCode } from '../code/getBlockAroundPosition.use.case';
import { GetBlockList } from '../code/getBlockList.use.case';
import { GetParametersFromBlock } from '../code/getParametersFromBlock.use.case';
import { DeclaredVariable, GetVariablesFromBlock } from '../code/getVariablesFromBlock.use.case';
import {
    UndeclaredVariablesDiagnosticPublisher,
    UndeclaredVariablesDiagnosticPublisherContract,
} from './undeclaredVariablesDiagnosticPublisher';
import { UndeclaredVariableUsageAnalyzer } from './undeclaredVariableUsageAnalyzer';

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
        if (document.languageId !== 'uniface') {
            this.publisher.clear(document);
            return;
        }

        const blocks = this.dependencies.getBlocks(document);
        if (blocks.length === 0) {
            this.publisher.clear(document);
            return;
        }

        const returnValueFunctionNames = this.getReturnValueFunctionNames(blocks);
        const usages = blocks.flatMap((block) => {
            const declaredVariables = [
                ...this.dependencies.getVariables(block),
                ...this.dependencies.getParameters(block),
            ];
            const declaredNames = declaredVariables.map((variable) => variable.name);

            return this.usageAnalyzer.getUndeclaredUsages(
                block,
                declaredNames,
                returnValueFunctionNames,
                declaredVariables
            );
        });

        this.publisher.publish(document, usages);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.publisher.clear(document);
    }

    private getReturnValueFunctionNames(blocks: BlockCode[]): string[] {
        return blocks.flatMap((block) => {
            const functionName = /^\s*(?:entry|function)\s+([A-Za-z_]\w*)\b/i.exec(block.lines[0]);
            const hasReturnValue = block.lines.some((line) => /^\s*returns\s+\w+\b/i.test(line));

            return functionName && hasReturnValue ? [functionName[1]] : [];
        });
    }

    public dispose(): void {
        this.publisher.dispose();
    }
}

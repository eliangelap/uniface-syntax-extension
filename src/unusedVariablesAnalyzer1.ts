import * as vscode from 'vscode';
import { BlockCode } from './code/getBlockAroundPosition.use.case';
import {
    DeclaredVariable,
    GetVariablesFromBlock,
} from './code/getVariablesFromBlock.use.case';
import { GetBlockList } from './code/getBlockList.use.case';

export class UnifaceUnusedVariableAnalyzer {
    private diagnostics: vscode.DiagnosticCollection;

    constructor() {
        this.diagnostics =
            vscode.languages.createDiagnosticCollection('uniface');
    }

    public analyzeDocument(document: vscode.TextDocument): void {
        if (document.languageId !== 'uniface') {
            return;
        }

        const blockList = new GetBlockList().execute(document);
        const diagnostics = [];
        let i = 0;

        for (const block of blockList) {
            console.log(i++);
            const declaredVariables = new GetVariablesFromBlock().execute(
                block
            );

            const lines = block.text.split('\n');

            const usedVariables = this.extractUsedVariables(
                block,
                declaredVariables
            );

            diagnostics.push(
                ...this.generateDiagnostics(
                    lines,
                    declaredVariables,
                    usedVariables
                )
            );
        }

        console.log('oiiiiiiiiiiiiiii');

        this.diagnostics.set(document.uri, diagnostics);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.diagnostics.delete(document.uri);
    }

    public dispose(): void {
        this.diagnostics.dispose();
    }

    private extractUsedVariables(
        block: BlockCode,
        declaredVariables: DeclaredVariable[]
    ): Set<string> {
        const used = new Set<string>();
        const lines = block.text.split('\n');
        let insideBlock = false;

        for (const [i, lineRaw] of lines.entries()) {
            const line = lineRaw.trim();

            if (!insideBlock) {
                console.log(line);
            }

            if (this.isBlockStart(line)) {
                insideBlock = true;
                continue;
            }

            if (!insideBlock) {
                continue;
            }

            for (const variable of declaredVariables) {
                if (i === variable.line) {
                    continue;
                }
                const regex = new RegExp(`\\b${variable.name}\\b`);

                if (regex.test(line)) {
                    used.add(variable.name);
                }
            }
        }

        return used;
    }

    private generateDiagnostics(
        lines: string[],
        declared: DeclaredVariable[],
        used: Set<string>
    ): vscode.Diagnostic[] {
        return declared
            .filter((variable) => !used.has(variable.name))
            .map((variable) => {
                const lineText = lines[variable.line];
                const range = new vscode.Range(
                    new vscode.Position(variable.line, 0),
                    new vscode.Position(variable.line, lineText.length)
                );

                return new vscode.Diagnostic(
                    range,
                    `Unused variable "${variable.name}".`,
                    vscode.DiagnosticSeverity.Warning
                );
            });
    }

    private isBlockStart(line: string): boolean {
        return /^(endvariables)\b/i.test(line);
    }
}

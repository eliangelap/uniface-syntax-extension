import * as vscode from "vscode";
import { GetBlockAroundPostion } from "./code/getBlockAroundPosition.use.case";
import {
    DeclaredVariable,
    GetVariablesFromBlock,
} from "./code/getVariablesFromBlock.use.case";
import { CodeAnalyzer } from "./util/codeAnalyzer.use.case";

export class UnifaceUnusedVariableAnalyzer {
    private diagnostics: vscode.DiagnosticCollection;

    constructor() {
        this.diagnostics =
            vscode.languages.createDiagnosticCollection("uniface");
    }

    public analyzeDocument(document: vscode.TextDocument): void {
        if (document.languageId !== "uniface") {
            return;
        }

        const editor = vscode.window.activeTextEditor;
        const position = editor?.selection.active;
        if (!position) {
            return;
        }

        const block = new GetBlockAroundPostion().execute(document, position);
        if (!block) {
            return;
        }

        const declaredVariables = new GetVariablesFromBlock().execute(block);
        const textLines = document.getText().split("\n");

        const blockLines = block.lines;
        const usedVariables = this.getUsedVariables(
            blockLines,
            declaredVariables
        );

        const diagnostics: vscode.Diagnostic[] = [];

        const ununsedVariables = declaredVariables.filter(
            (v) => !usedVariables.has(v.name)
        );

        for (const ununsedVariable of ununsedVariables) {
            const range = new vscode.Range(
                new vscode.Position(ununsedVariable.line, 0),
                new vscode.Position(
                    ununsedVariable.line,
                    textLines[ununsedVariable.line].length
                )
            );

            diagnostics.push(
                new vscode.Diagnostic(
                    range,
                    `Variable "${ununsedVariable.name}" is declared but is not used.`,
                    vscode.DiagnosticSeverity.Warning
                )
            );
        }

        this.diagnostics.set(document.uri, diagnostics);
    }

    private getUsedVariables(
        blockLines: string[],
        declaredVariables: DeclaredVariable[]
    ): Set<string> {
        const usedVariables = new Set<string>();
        let isAfterVarBlock: boolean = false;

        for (const line of blockLines) {
            const trimmedLine = line.trim();

            if (/^endvariables\b/i.test(trimmedLine)) {
                isAfterVarBlock = true;
                continue;
            }

            if (!isAfterVarBlock) {
                continue;
            }

            for (const variable of declaredVariables) {
                if (CodeAnalyzer.isComment(trimmedLine)) {
                    continue;
                }

                const name = variable.name;
                const pattern = new RegExp(
                    `\\b${this.escapeRegExp(name)}\\b`,
                    "i"
                );
                if (pattern.test(line)) {
                    usedVariables.add(name);
                }
            }
        }

        return usedVariables;
    }

    /**
     * Escapa caracteres especiais para usar dentro de um RegExp dinâmico.
     */
    private escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.diagnostics.delete(document.uri);
    }

    public dispose(): void {
        this.diagnostics.dispose();
    }
}

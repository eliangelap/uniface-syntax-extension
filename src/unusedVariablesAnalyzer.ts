import * as vscode from "vscode";
import { GetBlockAroundPostion } from "./code/getBlockAroundPosition.use.case";
import {
    GetVariablesFromBlock,
} from "./code/getVariablesFromBlock.use.case";

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
        const usedVariables = new Set<string>();

        let isOutsideVariableBlock: boolean = false;

        for (const line of blockLines) {
            const trimmedLine = line.trim();

            if (/^endvariables\b/i.test(trimmedLine)) {
                isOutsideVariableBlock = true;
                continue;
            }

            if (!isOutsideVariableBlock) {
                continue;
            }

            for (const variable of declaredVariables) {
                const regex = new RegExp(`\\b${variable.name}\\b`);
                if (regex.test(trimmedLine)) {
                    usedVariables.add(variable.name);
                }
            }
        }

        const diagnostics: vscode.Diagnostic[] = [];

        const ununsedVariables = declaredVariables.filter(
            (v) => !usedVariables.has(v.name)
        );

        for (const ununsedVariable of ununsedVariables) {
            const range = new vscode.Range(
                new vscode.Position(ununsedVariable.line, 0),
                new vscode.Position(ununsedVariable.line, textLines[ununsedVariable.line].length)
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

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.diagnostics.delete(document.uri);
    }

    public dispose(): void {
        this.diagnostics.dispose();
    }
}

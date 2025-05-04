import * as vscode from 'vscode';

export class UndeclaredVariableAnalyzer {
    private diagnostics: vscode.DiagnosticCollection;

    constructor() {
        this.diagnostics =
            vscode.languages.createDiagnosticCollection('uniface-undeclared');
    }

    public analyzeDocument(document: vscode.TextDocument): void {
        // 
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.diagnostics.delete(document.uri);
    }

    public dispose(): void {
        this.diagnostics.dispose();
    }
}

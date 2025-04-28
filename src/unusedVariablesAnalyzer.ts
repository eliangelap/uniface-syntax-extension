import * as vscode from 'vscode';

export class UnifaceUnusedVariableAnalyzer {
    private diagnostics: vscode.DiagnosticCollection;

    constructor() {
        this.diagnostics = vscode.languages.createDiagnosticCollection('uniface');
    }

    public analyzeDocument(document: vscode.TextDocument): void {
        if (document.languageId !== 'uniface') return;

        const text = document.getText();
        const lines = text.split('\n');

        const declaredVariables: { name: string; line: number }[] = [];
        const usedVariables = new Set<string>();

        let insideVariables = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Detecta início do bloco de variáveis
            if (/^variables\b/i.test(line)) {
                insideVariables = true;
                continue;
            }

            // Detecta fim do bloco de variáveis
            if (/^endvariables\b/i.test(line)) {
                insideVariables = false;
                continue;
            }

            // Coleta variáveis declaradas
            if (insideVariables) {
                const match = line.match(/^\s*(?:string|numeric|boolean)\s+(\w+)/i);
                if (match) {
                    declaredVariables.push({ name: match[1], line: i });
                }
                continue;
            }

            // Coleta variáveis usadas
            for (const variable of declaredVariables) {
                const regex = new RegExp(`\\b${this.escapeRegExp(variable.name)}\\b`);
                if (regex.test(line)) {
                    usedVariables.add(variable.name);
                }
            }
        }

        // Cria warnings
        const diagnostics: vscode.Diagnostic[] = declaredVariables
            .filter((v) => !usedVariables.has(v.name))
            .map((v) => {
                const range = new vscode.Range(
                    new vscode.Position(v.line, 0),
                    new vscode.Position(v.line, lines[v.line].length)
                );

                return new vscode.Diagnostic(
                    range,
                    `Variável "${v.name}" declarada mas não utilizada.`,
                    vscode.DiagnosticSeverity.Warning
                );
            });

        this.diagnostics.set(document.uri, diagnostics);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.diagnostics.delete(document.uri);
    }

    public dispose(): void {
        this.diagnostics.dispose();
    }

    private escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

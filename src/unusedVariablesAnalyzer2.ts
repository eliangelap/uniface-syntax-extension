import * as vscode from 'vscode';

interface DeclaredVariable {
    name: string;
    line: number;
}

export class UnifaceUnusedVariableAnalyzer {
    private diagnostics: vscode.DiagnosticCollection;

    constructor() {
        this.diagnostics =
            vscode.languages.createDiagnosticCollection('uniface');
    }

    public analyzeDocument(document: vscode.TextDocument): void {
        if (document.languageId !== 'uniface') return;

        const lines = document.getText().split('\n');
        const declaredVariables = this.extractDeclaredVariables(lines);
        const usedVariables = this.extractUsedVariables(
            lines,
            declaredVariables
        );

        const diagnostics = this.generateDiagnostics(
            lines,
            declaredVariables,
            usedVariables
        );
        this.diagnostics.set(document.uri, diagnostics);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.diagnostics.delete(document.uri);
    }

    public dispose(): void {
        this.diagnostics.dispose();
    }

    private extractDeclaredVariables(lines: string[]): DeclaredVariable[] {
        const variables: DeclaredVariable[] = [];
        let insideBlock = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (this.isBlockStart(line)) {
                insideBlock = true;
                continue;
            }

            if (this.isBlockEnd(line)) {
                insideBlock = false;
                continue;
            }

            if (insideBlock) {
                const match = line.match(/^variables\s+(?:\w+\s+)?(\w+)/i);
                if (match) {
                    variables.push({ name: match[1], line: i });
                }
            }
        }

        return variables;
    }

    private extractUsedVariables(
        lines: string[],
        declaredVariables: DeclaredVariable[]
    ): Set<string> {
        const used = new Set<string>();
        let insideBlock = false;

        for (const [i, lineRaw] of lines.entries()) {
            const line = lineRaw.trim();

            if (this.isBlockStart(line)) {
                insideBlock = true;
                continue;
            }

            if (this.isBlockEnd(line)) {
                insideBlock = false;
                continue;
            }

            if (insideBlock) {
                for (const variable of declaredVariables) {
                    if (i === variable.line) continue; // skip own declaration line
                    const regex = new RegExp(`\\b${variable.name}\\b`);
                    if (regex.test(line)) {
                        used.add(variable.name);
                    }
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
                    `Variável "${variable.name}" declarada mas não utilizada.`,
                    vscode.DiagnosticSeverity.Warning
                );
            });
    }

    private isBlockStart(line: string): boolean {
        return /^(entry|operation)\b/i.test(line);
    }

    private isBlockEnd(line: string): boolean {
        return /^end\s*(entry|operation)?\b/i.test(line);
    }
}

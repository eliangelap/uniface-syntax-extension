import * as vscode from 'vscode';

export class UndeclaredVariableAnalyzer {
    private diagnostics: vscode.DiagnosticCollection;

    constructor() {
        this.diagnostics =
            vscode.languages.createDiagnosticCollection('uniface-undeclared');
    }

    public analyzeDocument(document: vscode.TextDocument): void {
        if (document.languageId !== 'uniface') return;

        const text = document.getText();
        const lines = text.split('\n');
        const declaredVariables = new Set<string>();
        const usedVariables = new Map<string, number[]>(); // nome -> linhas

        let insideBlock = false;
        let insideVariables = false;

        for (let i = 0; i < lines.length; i++) {
            const rawLine = lines[i];
            const line = rawLine.trim();

            // Início do bloco
            if (/^(entry|operation)\b/i.test(line)) {
                insideBlock = true;
                continue;
            }

            // Fim do bloco
            if (/^\s*end\b/i.test(line)) {
                insideBlock = false;
                insideVariables = false;
                continue;
            }

            if (!insideBlock) continue;

            // Detecta início/fim de declaração de variáveis
            if (/^\s*variables\b/i.test(line)) {
                insideVariables = true;
                continue;
            }

            if (/^\s*endvariables\b/i.test(line)) {
                insideVariables = false;
                continue;
            }

            // Coleta variáveis declaradas
            if (insideVariables) {
                const match = line.match(
                    /\b(?:string|numeric|date|datetime|float|double)\s+(\w+)/i
                );
                if (match) {
                    declaredVariables.add(match[1]);
                }
                continue;
            }

            // Coleta variáveis usadas no restante do código
            const wordMatches = [...rawLine.matchAll(/\b\w+\b/g)];
            for (const match of wordMatches) {
                const word = match[0];
                if (!usedVariables.has(word)) {
                    usedVariables.set(word, []);
                }
                usedVariables.get(word)!.push(i);
            }
        }

        // Verifica variáveis usadas mas não declaradas
        const diagnostics: vscode.Diagnostic[] = [];

        for (const [variable, linesUsed] of usedVariables.entries()) {
            if (
                !declaredVariables.has(variable) &&
                !this.isReservedWord(variable)
            ) {
                for (const lineNum of linesUsed) {
                    const lineText = lines[lineNum];
                    const index = lineText.indexOf(variable);
                    if (index === -1) continue;

                    if (typeof variable === 'number') {
                        continue;
                    }

                    const range = new vscode.Range(
                        new vscode.Position(lineNum, index),
                        new vscode.Position(lineNum, index + variable.length)
                    );

                    diagnostics.push(
                        new vscode.Diagnostic(
                            range,
                            `Variável "${variable}" usada mas não declarada.`,
                            vscode.DiagnosticSeverity.Error
                        )
                    );
                }
            }
        }

        this.diagnostics.set(document.uri, diagnostics);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.diagnostics.delete(document.uri);
    }

    public dispose(): void {
        this.diagnostics.dispose();
    }

    private isReservedWord(word: string): boolean {
        const reserved = new Set([
            'entry',
            'operation',
            'return',
            'if',
            'endif',
            'call',
            'goto',
            'while',
            'endwhile',
            'for',
            'endfor',
            'else',
            'elseif',
            'break',
            'continue',
            'store',
            'retrieve',
            'clear',
            '$status',
            '$datim',
            '$procerrorcontext',
            '$t_ds_erro$',
            'rollback',
            'commit',
            'activate',
            'putitem',
            'putitem/id',
        ]);
        return reserved.has(word.toLowerCase());
    }
}

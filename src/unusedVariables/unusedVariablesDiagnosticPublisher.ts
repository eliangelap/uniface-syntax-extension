import * as vscode from 'vscode';
import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';

export interface UnusedVariablesDiagnosticPublisherContract {
    publish(document: vscode.TextDocument, unusedVariables: DeclaredVariable[]): void;
    clear(document: vscode.TextDocument): void;
    dispose(): void;
}

export class UnusedVariablesDiagnosticPublisher implements UnusedVariablesDiagnosticPublisherContract {
    constructor(
        private readonly diagnostics: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection(
            'uniface'
        )
    ) {}

    public publish(document: vscode.TextDocument, unusedVariables: DeclaredVariable[]): void {
        const diagnostics = unusedVariables.map((variable) => {
            const line = document.lineAt(variable.line);

            return new vscode.Diagnostic(
                line.range,
                `Variable "${variable.name}" is declared but is not used.`,
                vscode.DiagnosticSeverity.Warning
            );
        });

        this.diagnostics.set(document.uri, diagnostics);
    }

    public clear(document: vscode.TextDocument): void {
        this.diagnostics.delete(document.uri);
    }

    public dispose(): void {
        this.diagnostics.dispose();
    }
}

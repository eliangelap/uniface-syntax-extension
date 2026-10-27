import * as vscode from 'vscode';
import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';

export const unusedVariableDiagnosticCode = 'uniface.unusedVariable';
export const uninitializedVariableDiagnosticCode = 'uniface.uninitializedVariable';

export interface VariableDiagnostic {
    variable: DeclaredVariable;
    message: string;
    code: string;
    range?: vscode.Range;
}

export interface UnusedVariablesDiagnosticPublisherContract {
    publish(document: vscode.TextDocument, diagnostics: VariableDiagnostic[]): void;
    clear(document: vscode.TextDocument): void;
    dispose(): void;
}

export class UnusedVariablesDiagnosticPublisher implements UnusedVariablesDiagnosticPublisherContract {
    constructor(
        private readonly diagnostics: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection(
            'uniface'
        )
    ) {}

    public publish(document: vscode.TextDocument, variableDiagnostics: VariableDiagnostic[]): void {
        const diagnostics = variableDiagnostics.map(({ variable, message, code, range }) => {
            const diagnostic = new vscode.Diagnostic(
                range ?? document.lineAt(variable.line).range,
                message,
                vscode.DiagnosticSeverity.Warning
            );
            diagnostic.code = code;

            return diagnostic;
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

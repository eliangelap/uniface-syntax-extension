import * as vscode from 'vscode';
import { UndeclaredVariableUsage } from './undeclaredVariableUsageAnalyzer';

export const undeclaredVariableDiagnosticCode = 'uniface.undeclaredVariable';
export const invalidExtractionParameterDiagnosticCode = 'uniface.invalidExtractionParameter';

export interface UndeclaredVariablesDiagnosticPublisherContract {
    publish(document: vscode.TextDocument, usages: UndeclaredVariableUsage[]): void;
    clear(document: vscode.TextDocument): void;
    dispose(): void;
}

export class UndeclaredVariablesDiagnosticPublisher
    implements UndeclaredVariablesDiagnosticPublisherContract
{
    constructor(
        private readonly diagnostics: vscode.DiagnosticCollection =
            vscode.languages.createDiagnosticCollection('uniface-undeclared')
    ) {}

    public publish(document: vscode.TextDocument, usages: UndeclaredVariableUsage[]): void {
        const diagnostics = usages.map((usage) => {
            const diagnostic = new vscode.Diagnostic(
                usage.range,
                usage.message ?? `Variable "${usage.name}" is not declared.`,
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.code = usage.diagnosticCode ?? undeclaredVariableDiagnosticCode;

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

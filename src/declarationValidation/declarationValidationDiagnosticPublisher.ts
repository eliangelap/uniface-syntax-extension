import * as vscode from 'vscode';

export type DeclarationIssueKind = 'duplicateVariable' | 'missingVariableName';

export interface DeclarationIssue {
    kind: DeclarationIssueKind;
    name?: string;
    range: vscode.Range;
}

export interface DeclarationValidationDiagnosticPublisherContract {
    publish(document: vscode.TextDocument, issues: DeclarationIssue[]): void;
    clear(document: vscode.TextDocument): void;
    dispose(): void;
}

export class DeclarationValidationDiagnosticPublisher
    implements DeclarationValidationDiagnosticPublisherContract
{
    constructor(
        private readonly diagnostics: vscode.DiagnosticCollection =
            vscode.languages.createDiagnosticCollection('uniface-declarations')
    ) {}

    public publish(document: vscode.TextDocument, issues: DeclarationIssue[]): void {
        this.diagnostics.set(
            document.uri,
            issues.map((issue) => {
                const diagnostic = new vscode.Diagnostic(
                    issue.range,
                    this.getMessage(issue),
                    vscode.DiagnosticSeverity.Error
                );
                diagnostic.code = `uniface.${issue.kind}`;

                return diagnostic;
            })
        );
    }

    public clear(document: vscode.TextDocument): void {
        this.diagnostics.delete(document.uri);
    }

    public dispose(): void {
        this.diagnostics.dispose();
    }

    private getMessage(issue: DeclarationIssue): string {
        if (issue.kind === 'duplicateVariable') {
            return `Variable "${issue.name}" is declared more than once.`;
        }

        return 'Expected a variable name between commas.';
    }
}

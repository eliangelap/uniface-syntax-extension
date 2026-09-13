import * as vscode from 'vscode';

export interface MissingBlockEnd {
    blockType: 'entry' | 'operation';
    name: string;
    line: number;
}

export interface BlockStructureDiagnosticPublisherContract {
    publish(document: vscode.TextDocument, missingEnds: MissingBlockEnd[]): void;
    clear(document: vscode.TextDocument): void;
    dispose(): void;
}

export class BlockStructureDiagnosticPublisher implements BlockStructureDiagnosticPublisherContract {
    constructor(
        private readonly diagnostics: vscode.DiagnosticCollection =
            vscode.languages.createDiagnosticCollection('uniface-block-structure')
    ) {}

    public publish(document: vscode.TextDocument, missingEnds: MissingBlockEnd[]): void {
        this.diagnostics.set(
            document.uri,
            missingEnds.map((missingEnd) => {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(missingEnd.line, 0, missingEnd.line, 0),
                    `Missing END for ${missingEnd.blockType} "${missingEnd.name}".`,
                    vscode.DiagnosticSeverity.Error
                );
                diagnostic.code = 'uniface.missingBlockEnd';

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
}

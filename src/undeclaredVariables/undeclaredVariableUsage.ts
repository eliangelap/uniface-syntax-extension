import * as vscode from 'vscode';

export interface UndeclaredVariableUsage {
    name: string;
    range: vscode.Range;
    message?: string;
    diagnosticCode?: string;
}

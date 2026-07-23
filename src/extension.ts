import * as vscode from 'vscode';
import { CompletionItemProvider } from './completionProvider';
import { UnifaceDefinitionProvider } from './definition/entryDefinition';
import { formatterProvider } from './formatterProvider';
import { registerGoldDecorationEvents } from './gold/goldDecorator';
import { registerGoldInterceptor } from './gold/goldHandler';
import { registerTreeDataProvider } from './sidebar/entryTreeProvider';
import { EntryCreator } from './snippets/entryCreator';
import { OperationCreator } from './snippets/operationCreator';
import { UnifaceUnusedVariableAnalyzer } from './unusedVariables/unusedVariablesAnalyzer';
import { UnifaceSignatureHelpProvider } from './signatureHelpProvider';
import { UndeclaredVariableAnalyzer } from './undeclaredVariables/undeclaredVariableAnalyzer';
import {
    declareVariableCommand,
    UndeclaredVariableQuickFixProvider,
} from './undeclaredVariables/undeclaredVariableQuickFixProvider';
import { DeclareVariableCommand } from './undeclaredVariables/declareVariableCommand';

interface PromptAndInsert {
    promptAndInsert(): Promise<void>;
}

interface DocumentAnalyzer {
    analyzeDocument(document: vscode.TextDocument): void;
}

export function runPromptAndInsert(creator: PromptAndInsert): Promise<void> {
    return creator.promptAndInsert();
}

export function shouldAnalyzeDocument(document: vscode.TextDocument): boolean {
    return document.languageId === 'uniface';
}

export function analyzeOpenUnifaceDocuments(
    documents: readonly vscode.TextDocument[],
    analyzers: DocumentAnalyzer[]
): void {
    for (const document of documents) {
        if (!shouldAnalyzeDocument(document)) {
            continue;
        }

        for (const analyzer of analyzers) {
            analyzer.analyzeDocument(document);
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    registerGoldInterceptor(context);
    registerGoldDecorationEvents(context);
    registerTreeDataProvider(context);

    const variableAnalyzer = new UnifaceUnusedVariableAnalyzer();
    const undeclaredVariableAnalyzer = new UndeclaredVariableAnalyzer();
    const declarationCommand = new DeclareVariableCommand();
    const analyzers = [variableAnalyzer, undeclaredVariableAnalyzer];
    const analysisTimers = new Map<string, ReturnType<typeof setTimeout>>();
    const analyzeDocument = (document: vscode.TextDocument) => {
        analyzeOpenUnifaceDocuments([document], analyzers);
    };
    const scheduleAnalysis = (document: vscode.TextDocument) => {
        if (!shouldAnalyzeDocument(document)) {
            return;
        }

        const key = document.uri.toString();
        const previousTimer = analysisTimers.get(key);
        if (previousTimer) {
            clearTimeout(previousTimer);
        }

        analysisTimers.set(
            key,
            setTimeout(() => {
                analysisTimers.delete(key);
                analyzeDocument(document);
            }, 250)
        );
    };

    context.subscriptions.push(
        vscode.commands.registerCommand('uniface-extension.entry', () => {
            return runPromptAndInsert(new EntryCreator());
        }),
        vscode.commands.registerCommand('uniface-extension.operation', () => {
            return runPromptAndInsert(new OperationCreator());
        }),
        vscode.commands.registerCommand(declareVariableCommand, (uri, name, usageLine) => {
            return declarationCommand.execute(uri, name, usageLine);
        }),
        vscode.languages.registerCompletionItemProvider('uniface', new CompletionItemProvider()),
        vscode.languages.registerDocumentFormattingEditProvider('uniface', formatterProvider()),
        vscode.languages.registerDefinitionProvider('uniface', new UnifaceDefinitionProvider()),
        vscode.languages.registerCodeActionsProvider(
            'uniface',
            new UndeclaredVariableQuickFixProvider(),
            { providedCodeActionKinds: UndeclaredVariableQuickFixProvider.providedCodeActionKinds }
        ),
        vscode.languages.registerSignatureHelpProvider(
            { language: 'uniface' },
            new UnifaceSignatureHelpProvider(),
            '(',
            ','
        ),
        vscode.workspace.onDidOpenTextDocument((doc) => {
            analyzeDocument(doc);
        }),
        vscode.workspace.onDidChangeTextDocument((e) => {
            scheduleAnalysis(e.document);
        }),
        vscode.workspace.onDidCloseTextDocument((doc) => {
            const key = doc.uri.toString();
            const timer = analysisTimers.get(key);
            if (timer) {
                clearTimeout(timer);
                analysisTimers.delete(key);
            }
            variableAnalyzer.clearDiagnostics(doc);
            undeclaredVariableAnalyzer.clearDiagnostics(doc);
        }),
        {
            dispose: () => {
                for (const timer of analysisTimers.values()) {
                    clearTimeout(timer);
                }
                analysisTimers.clear();
            },
        },
        variableAnalyzer,
        undeclaredVariableAnalyzer
    );

    analyzeOpenUnifaceDocuments(vscode.workspace.textDocuments, analyzers);
}

export function deactivate() {
    return undefined;
}

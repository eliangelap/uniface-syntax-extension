import * as vscode from 'vscode';
import { GetStatementList } from './code/getStatementList.use.case';
import { GetBlockAroundPosition } from './code/getBlockAroundPosition.use.case';
import { GetEntriesCompletionList } from './code/getEntriesCompletionList.use.case';
import { GetParametersFromBlock } from './code/getParametersFromBlock.use.case';
import { GetUnifaceProcFunctionList } from './code/getUnifaceProcFunctionList.use.case';
import { GetVariablesFromBlock } from './code/getVariablesFromBlock.use.case';
import { VariablesToCompletionItems } from './code/variablesToCompletionItems.use.case';
import { CodeAnalyzer } from './util/codeAnalyzer.use.case';
import { isBlockdataLine } from './util/procCodeScanner';

export class CompletionItemProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
        const completions: vscode.CompletionItem[] = [];
        const lineText = document.lineAt(position).text.trim();

        if (
            CodeAnalyzer.isLineCommented(lineText) ||
            isBlockdataLine(document.getText().split('\n'), position.line)
        ) {
            return [];
        }

        const entries = new GetEntriesCompletionList().execute(document, position);

        if (entries.length > 0) {
            return this.removeDuplicateCompletions(entries);
        }

        const blockText = new GetBlockAroundPosition().execute(document, position);

        if (!blockText) {
            return [];
        }

        const parameters = new GetParametersFromBlock().execute(blockText);
        const variables = new GetVariablesFromBlock().execute(blockText);
        const reservedFunctions = new GetUnifaceProcFunctionList().execute();
        const dollarPrefixedTokenRange = this.getDollarPrefixedTokenRange(document, position);

        completions.push(
            ...this.getStatementCompletions(),
            ...new VariablesToCompletionItems().execute(
                [...parameters, ...variables],
                dollarPrefixedTokenRange ?? undefined
            )
        );

        if (dollarPrefixedTokenRange) {
            const procFunctionCompletions = reservedFunctions.map((procFunction) => {
                const completion = new vscode.CompletionItem(
                    procFunction.name,
                    vscode.CompletionItemKind.Method
                );

                completion.insertText = procFunction.name;
                completion.range = dollarPrefixedTokenRange;
                completion.documentation = new vscode.MarkdownString(
                    `[Official documentation](${procFunction.link})`
                );

                if (procFunction.deprecated) {
                    completion.tags = [vscode.CompletionItemTag.Deprecated];
                    completion.detail = 'Deprecated';
                }

                return completion;
            });

            completions.push(...procFunctionCompletions);
        }

        return this.removeDuplicateCompletions(completions);
    };

    private getDollarPrefixedTokenRange(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Range | null {
        const textBeforeCursor = document.lineAt(position).text.slice(0, position.character);
        const match = /\$\w*$/.exec(textBeforeCursor);

        if (match?.index === undefined) {
            return null;
        }

        return new vscode.Range(position.line, match.index, position.line, position.character);
    }

    private getStatementCompletions(): vscode.CompletionItem[] {
        return new GetStatementList().execute().map((statement) => {
            const completion = new vscode.CompletionItem(
                statement.name,
                vscode.CompletionItemKind.Keyword
            );
            completion.insertText = statement.name;

            if (statement.docs || statement.syntax || statement.link) {
                const documentation = new vscode.MarkdownString();
                if (statement.docs) {
                    documentation.appendMarkdown(statement.docs);
                }
                if (statement.syntax) {
                    documentation.appendCodeblock(statement.syntax, 'uniface');
                }
                if (statement.link) {
                    documentation.appendMarkdown(`\n\n[Official documentation](${statement.link})`);
                }
                completion.documentation = documentation;
            }
            if (statement.params.length > 0) {
                completion.detail = statement.params.join(', ');
            }
            if (statement.deprecated) {
                completion.tags = [vscode.CompletionItemTag.Deprecated];
                completion.detail = 'Deprecated';
            }
            return completion;
        });
    }

    private removeDuplicateCompletions(
        completions: vscode.CompletionItem[]
    ): vscode.CompletionItem[] {
        const labels = new Set<string>();

        return completions.filter((completion) => {
            const label =
                typeof completion.label === 'string' ? completion.label : completion.label.label;
            const normalizedLabel = label.toLowerCase();

            if (labels.has(normalizedLabel)) {
                return false;
            }

            labels.add(normalizedLabel);
            return true;
        });
    }
}

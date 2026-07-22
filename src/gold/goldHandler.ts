import * as vscode from 'vscode';

const goldSequences: Record<string, string> = {
    '+;': '\x1B',
    '+=': '\x12',
    '+!': '\x15',
    '+<': '\x14',
    '+>': '\x13',
    '+&': '\x16',
    '+|': '\x17',
    '+?': '\x11',
    '+*': '\x10',
};

export interface GoldReplacement {
    startCharacter: number;
    endCharacter: number;
    replacement: string;
}

export function isInsideString(lineText: string, character: number): boolean {
    let stringDelimiter: '"' | "'" | null = null;
    let isEscaped = false;

    for (let i = 0; i < character; i++) {
        const currentCharacter = lineText[i];

        if (isEscaped) {
            isEscaped = false;
            continue;
        }

        if (currentCharacter === '\\') {
            isEscaped = true;
            continue;
        }

        if (stringDelimiter === currentCharacter) {
            stringDelimiter = null;
            continue;
        }

        if (!stringDelimiter && (currentCharacter === '"' || currentCharacter === "'")) {
            stringDelimiter = currentCharacter;
        }
    }

    return stringDelimiter !== null;
}

export function getGoldReplacement(
    lineText: string,
    insertedCharacter: number
): GoldReplacement | null {
    const textUpToInsertedCharacter = lineText.slice(0, insertedCharacter + 1);

    for (const [sequence, replacement] of Object.entries(goldSequences)) {
        if (!textUpToInsertedCharacter.endsWith(sequence)) {
            continue;
        }

        const startCharacter = insertedCharacter - (sequence.length - 1);
        if (!isInsideString(lineText, startCharacter)) {
            return null;
        }

        return {
            startCharacter,
            endCharacter: insertedCharacter + 1,
            replacement,
        };
    }

    return null;
}

export function getGoldReplacements(
    document: vscode.TextDocument,
    changes: readonly vscode.TextDocumentContentChangeEvent[]
): vscode.Range[] {
    const replacements: vscode.Range[] = [];

    for (const change of changes) {
        if (change.text.length !== 1 || change.rangeLength !== 0) {
            continue;
        }

        const insertedOffset =
            change.rangeOffset +
            changes
                .filter((otherChange) => otherChange.rangeOffset < change.rangeOffset)
                .reduce(
                    (offset, otherChange) =>
                        offset + otherChange.text.length - otherChange.rangeLength,
                    0
                );
        const insertedPosition = document.positionAt(insertedOffset);
        const lineText = document.lineAt(insertedPosition.line).text;
        const replacement = getGoldReplacement(lineText, insertedPosition.character);

        if (replacement) {
            replacements.push(
                new vscode.Range(
                    insertedPosition.line,
                    replacement.startCharacter,
                    insertedPosition.line,
                    replacement.endCharacter
                )
            );
        }
    }

    return replacements;
}

export function registerGoldInterceptor(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((event) => {
            const editor = vscode.window.activeTextEditor;
            if (
                !editor ||
                event.document !== editor.document ||
                event.document.languageId !== 'uniface'
            ) {
                return;
            }

            const ranges = getGoldReplacements(event.document, event.contentChanges);
            if (ranges.length === 0) {
                return;
            }

            void editor.edit((editBuilder) => {
                for (const range of ranges) {
                    const replacement = getGoldReplacement(
                        event.document.lineAt(range.start.line).text,
                        range.end.character - 1
                    );

                    if (replacement) {
                        editBuilder.replace(range, replacement.replacement);
                    }
                }
            }).then((success) => {
                if (!success) {
                    return;
                }
            });
        })
    );
}

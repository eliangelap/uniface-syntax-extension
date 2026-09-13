import * as vscode from 'vscode';
import { blockEndRegex } from '../regExpConstants';
import { CodeAnalyzer } from '../util/codeAnalyzer.use.case';
import {
    BlockStructureDiagnosticPublisher,
    BlockStructureDiagnosticPublisherContract,
    MissingBlockEnd,
} from './blockStructureDiagnosticPublisher';

const blockStartRegex = /^\s*(entry|operation)\s+([A-Za-z_]\w*)\b/i;

export function findMissingBlockEnds(lines: string[]): MissingBlockEnd[] {
    const missingEnds: MissingBlockEnd[] = [];
    let openBlock: MissingBlockEnd | undefined;

    for (let line = 0; line < lines.length; line++) {
        const trimmedLine = lines[line].trim();
        if (CodeAnalyzer.isLineCommented(trimmedLine)) {
            continue;
        }

        if (/^#enddefine\b/i.test(trimmedLine)) {
            if (openBlock) {
                missingEnds.push(openBlock);
                openBlock = undefined;
            }
            continue;
        }

        const blockStart = blockStartRegex.exec(trimmedLine);
        if (blockStart) {
            if (openBlock) {
                missingEnds.push(openBlock);
            }
            openBlock = {
                blockType: blockStart[1].toLowerCase() as MissingBlockEnd['blockType'],
                name: blockStart[2],
                line,
            };
            continue;
        }

        if (blockEndRegex.test(trimmedLine)) {
            openBlock = undefined;
        }
    }

    if (openBlock) {
        missingEnds.push(openBlock);
    }

    return missingEnds;
}

export class BlockStructureAnalyzer implements vscode.Disposable {
    constructor(
        private readonly publisher: BlockStructureDiagnosticPublisherContract =
            new BlockStructureDiagnosticPublisher()
    ) {}

    public analyzeDocument(document: vscode.TextDocument): void {
        if (document.languageId !== 'uniface') {
            this.publisher.clear(document);
            return;
        }

        this.publisher.publish(document, findMissingBlockEnds(document.getText().split(/\r?\n/)));
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.publisher.clear(document);
    }

    public dispose(): void {
        this.publisher.dispose();
    }
}

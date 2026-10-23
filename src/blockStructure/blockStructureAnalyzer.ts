import * as vscode from 'vscode';
import { blockEndRegex } from '../regExpConstants';
import { CodeAnalyzer } from '../util/codeAnalyzer.use.case';
import {
    createCodeScannerState,
    getCodeOutsideStringsAndComments,
    getNextCodeScannerState,
} from '../util/procCodeScanner';
import {
    BlockStructureDiagnosticPublisher,
    BlockStructureDiagnosticPublisherContract,
    MissingBlockEnd,
} from './blockStructureDiagnosticPublisher';
import { DocumentAnalysisSnapshot } from '../util/documentAnalysisSnapshot';

const blockStartRegex = /^\s*(entry|operation)\s+([A-Za-z_]\w*)\b/i;

export function findMissingBlockEnds(
    lines: readonly string[],
    sanitizedLines?: readonly string[]
): MissingBlockEnd[] {
    const missingEnds: MissingBlockEnd[] = [];
    let openBlock: MissingBlockEnd | undefined;
    let scannerState = createCodeScannerState();

    for (let line = 0; line < lines.length; line++) {
        const scanResult = sanitizedLines
            ? undefined
            : getCodeOutsideStringsAndComments(lines[line], scannerState);
        if (scanResult) {
            scannerState = getNextCodeScannerState(lines[line], scanResult.state);
        }
        const trimmedLine = (sanitizedLines?.[line] ?? scanResult?.code ?? '').trim();
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

    public analyzeSnapshot(snapshot: DocumentAnalysisSnapshot): void {
        if (snapshot.document.languageId !== 'uniface') {
            this.publisher.clear(snapshot.document);
            return;
        }

        this.publisher.publish(snapshot.document, snapshot.missingBlockEnds);
    }

    public clearDiagnostics(document: vscode.TextDocument): void {
        this.publisher.clear(document);
    }

    public dispose(): void {
        this.publisher.dispose();
    }
}

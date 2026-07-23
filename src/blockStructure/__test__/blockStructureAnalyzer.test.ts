import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { BlockStructureAnalyzer } from '../blockStructureAnalyzer';
import {
    BlockStructureDiagnosticPublisherContract,
    MissingBlockEnd,
} from '../blockStructureDiagnosticPublisher';

class DiagnosticPublisherStub implements BlockStructureDiagnosticPublisherContract {
    public missingEnds: MissingBlockEnd[] | undefined;

    public publish(_document: vscode.TextDocument, missingEnds: MissingBlockEnd[]): void {
        this.missingEnds = missingEnds;
    }

    public clear(): void {}

    public dispose(): void {}
}

suite('BlockStructureAnalyzer', () => {
    test('reports an operation without END before enddefine', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '#startdefine\noperation exec\n#enddefine',
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();

        new BlockStructureAnalyzer(publisher).analyzeDocument(document);

        assert.deepStrictEqual(publisher.missingEnds, [
            { blockType: 'operation', name: 'exec', line: 1 },
        ]);
    });

    test('reports an entry without END before another entry', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry first\nentry second\nend',
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();

        new BlockStructureAnalyzer(publisher).analyzeDocument(document);

        assert.deepStrictEqual(publisher.missingEnds, [
            { blockType: 'entry', name: 'first', line: 0 },
        ]);
    });

    test('reports a block left open at the end of the document', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'entry first\nendif',
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();

        new BlockStructureAnalyzer(publisher).analyzeDocument(document);

        assert.deepStrictEqual(publisher.missingEnds, [
            { blockType: 'entry', name: 'first', line: 0 },
        ]);
    });

    test('accepts closed blocks and ignores commented declarations', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: '; entry ignored\noperation valid\nend\n; #enddefine',
            language: 'uniface',
        });
        const publisher = new DiagnosticPublisherStub();

        new BlockStructureAnalyzer(publisher).analyzeDocument(document);

        assert.deepStrictEqual(publisher.missingEnds, []);
    });
});

import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { BlockCode } from '../../code/getBlockAroundPosition.use.case';
import { DeclarationValidationAnalyzer } from '../declarationValidationAnalyzer';
import {
    DeclarationIssue,
    DeclarationValidationDiagnosticPublisherContract,
} from '../declarationValidationDiagnosticPublisher';

class DiagnosticPublisherStub implements DeclarationValidationDiagnosticPublisherContract {
    public issues: DeclarationIssue[] | undefined;
    public clearedDocuments: vscode.TextDocument[] = [];

    public publish(_document: vscode.TextDocument, issues: DeclarationIssue[]): void {
        this.issues = issues;
    }

    public clear(document: vscode.TextDocument): void {
        this.clearedDocuments.push(document);
    }

    public dispose(): void {}
}

suite('DeclarationValidationAnalyzer', () => {
    test('reports duplicate names in variables and params without casing differences', async () => {
        const block = createBlock([
            'entry sample',
            'params',
            '    string parameter : in',
            'endparams',
            'variables',
            '    string value, VALUE',
            '    string PARAMETER',
            'endvariables',
            'end',
        ]);
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new DeclarationValidationAnalyzer(publisher, { getBlocks: () => [block] });
        const document = await createDocument(block.lines);

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(
            publisher.issues?.map((issue) => ({ kind: issue.kind, name: issue.name })),
            [
                { kind: 'duplicateVariable', name: 'VALUE' },
                { kind: 'duplicateVariable', name: 'PARAMETER' },
            ]
        );
    });

    test('reports a missing name between consecutive commas', async () => {
        const block = createBlock([
            'entry sample',
            'variables',
            '    string texto, , texto2',
            'endvariables',
            'end',
        ]);
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new DeclarationValidationAnalyzer(publisher, { getBlocks: () => [block] });
        const document = await createDocument(block.lines);

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.issues?.map((issue) => issue.kind), ['missingVariableName']);
    });

    test('does not compare declarations from separate blocks', async () => {
        const firstBlock = createBlock(['entry first', 'variables', 'string value', 'endvariables', 'end']);
        const secondBlock = { ...createBlock(['entry second', 'variables', 'string value', 'endvariables', 'end']), startLine: 5 };
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new DeclarationValidationAnalyzer(publisher, {
            getBlocks: () => [firstBlock, secondBlock],
        });
        const document = await createDocument([...firstBlock.lines, ...secondBlock.lines]);

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.issues, []);
    });

    test('skips validation when a block END is missing', async () => {
        const document = await createDocument(['entry incomplete', 'variables', 'string value']);
        const publisher = new DiagnosticPublisherStub();
        const analyzer = new DeclarationValidationAnalyzer(publisher, {
            getBlocks: () => {
                throw new Error('The declaration validator must not parse incomplete blocks');
            },
        });

        analyzer.analyzeDocument(document);

        assert.deepStrictEqual(publisher.clearedDocuments, [document]);
    });
});

function createBlock(lines: string[]): BlockCode {
    return { text: lines.join('\n'), startLine: 0, lines };
}

function createDocument(lines: string[]): Thenable<vscode.TextDocument> {
    return vscode.workspace.openTextDocument({ content: lines.join('\n'), language: 'uniface' });
}

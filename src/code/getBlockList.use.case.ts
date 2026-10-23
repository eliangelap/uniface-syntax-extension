import * as vscode from 'vscode';
import { BlockCode } from './getBlockAroundPosition.use.case';
import { DocumentAnalysisSnapshotBuilder } from '../util/documentAnalysisSnapshot';

export class GetBlockList {
    public execute(document: vscode.TextDocument): BlockCode[] {
        return new DocumentAnalysisSnapshotBuilder().build(document).blocks.map(
            ({ text, startLine, lines }) => ({ text, startLine, lines })
        );
    }
}

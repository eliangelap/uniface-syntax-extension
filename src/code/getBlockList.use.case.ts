import * as vscode from 'vscode';
import { BlockCode, GetBlockAroundPostion } from './getBlockAroundPosition.use.case';

export class GetBlockList {
    public execute(document: vscode.TextDocument): BlockCode[] {
        const lines = document.getText().split('\n');
        const blocks = [];

        let i = 0;
        while (i++ < lines.length) {
            const position = new vscode.Position(i, 0);

            const block = new GetBlockAroundPostion().execute(
                document,
                position
            );

            if (block !== null) {
                blocks.push(block);
                i += block.lines.length;
            }
        }

        return blocks;
    }
}

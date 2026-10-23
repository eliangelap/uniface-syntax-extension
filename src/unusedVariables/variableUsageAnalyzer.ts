import { DeclaredVariable } from '../code/getVariablesFromBlock.use.case';
import {
    createCodeScannerState,
    getCodeOutsideStringsAndComments,
    getNextCodeScannerState,
} from '../util/procCodeScanner';

export class VariableUsageAnalyzer {
    public getUsedVariables(
        blockLines: string[],
        declaredVariables: DeclaredVariable[]
    ): Set<string> {
        const usedVariables = new Set<string>();
        const declaredByName = new Map(
            declaredVariables.map((variable) => [variable.name.toLowerCase(), variable.name])
        );
        let isAfterVariablesBlock = false;
        let state = createCodeScannerState();

        for (const line of blockLines) {
            const trimmedLine = line.trim();

            if (!isAfterVariablesBlock) {
                if (/^endvariables\b(?:\s*;.*)?$/i.test(trimmedLine)) {
                    isAfterVariablesBlock = true;
                }
                continue;
            }

            const scanResult = getCodeOutsideStringsAndComments(line, state);
            state = getNextCodeScannerState(line, scanResult.state);
            const code = scanResult.code;
            const tokenRegex = /\b[A-Za-z_]\w*\b/g;
            let token: RegExpExecArray | null;
            while ((token = tokenRegex.exec(code)) !== null) {
                const declaredName = declaredByName.get(token[0].toLowerCase());
                if (declaredName) {
                    usedVariables.add(declaredName);
                }
            }
        }

        return usedVariables;
    }
}

export interface StatementContext {
    code: string;
    ignoredTokenStarts: Set<number>;
}

export class StatementContextAnalyzer {
    private isInsideSelectdbProjection = false;

    public constructor(private readonly statements: ReadonlySet<string>) {}

    public reset(): void {
        this.isInsideSelectdbProjection = false;
    }

    public analyze(code: string): StatementContext {
        const selectdbProjection = this.maskSelectdbProjection(code);
        this.isInsideSelectdbProjection = selectdbProjection.isInsideProjection;

        return {
            code: selectdbProjection.code,
            ignoredTokenStarts: new Set(
                [
                    this.getCallFunctionNameStart(selectdbProjection.code),
                    this.getActivateOperationNameStart(selectdbProjection.code),
                    this.getStatementModifierStart(selectdbProjection.code),
                ].filter((start): start is number => start !== undefined)
            ),
        };
    }

    private maskSelectdbProjection(code: string): { code: string; isInsideProjection: boolean } {
        const selectdb = /^\s*selectdb\b/i.exec(code);
        const projectionStart = selectdb
            ? selectdb[0].length
            : this.isInsideSelectdbProjection
              ? 0
              : undefined;

        if (projectionStart === undefined) {
            return { code, isInsideProjection: false };
        }

        const fromMatch = /\bfrom\b/i.exec(code.slice(projectionStart));
        const projectionEnd = fromMatch ? projectionStart + fromMatch.index : code.length;
        const maskedCode =
            code.slice(0, projectionStart) +
            ' '.repeat(projectionEnd - projectionStart) +
            code.slice(projectionEnd);

        return {
            code: maskedCode,
            isInsideProjection: !fromMatch && /%\\\s*$/.test(code),
        };
    }

    private getCallFunctionNameStart(code: string): number | undefined {
        const call = /^\s*call\s+([A-Za-z_]\w*)\b/i.exec(code);
        return call ? call.index + call[0].length - call[1].length : undefined;
    }

    private getActivateOperationNameStart(code: string): number | undefined {
        const activateOperation =
            /^\s*activate(?:\s*\/[A-Za-z_]\w*)*\s+.*?\.\s*([A-Za-z_]\w*)\s*\(/i.exec(code);
        return activateOperation
            ? activateOperation.index + activateOperation[0].lastIndexOf(activateOperation[1])
            : undefined;
    }

    private getStatementModifierStart(code: string): number | undefined {
        const statementModifier = /^\s*([A-Za-z_]\w*)\s*\/([A-Za-z_]\w*)\b/i.exec(code);
        if (!statementModifier || !this.statements.has(statementModifier[1].toLowerCase())) {
            return undefined;
        }

        return statementModifier.index + statementModifier[0].length - statementModifier[2].length;
    }
}

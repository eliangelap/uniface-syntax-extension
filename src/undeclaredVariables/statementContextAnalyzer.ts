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
        const contextCode = this.maskLabel(this.maskCompareFields(selectdbProjection.code));

        return {
            code: contextCode,
            ignoredTokenStarts: new Set(
                [
                    this.getCallFunctionNameStart(contextCode),
                    this.getActivateOperationNameStart(contextCode),
                    this.getGotoLabelStart(contextCode),
                    ...this.getStatementModifierStarts(contextCode),
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

    private maskCompareFields(code: string): string {
        const compare = /^\s*compare\s*\/\s*(?:next|previous)\b\s*(\([^)]*\))\s+from\b/i.exec(code);
        if (!compare) {
            return code;
        }

        const fieldList = compare[1];
        const fieldListStart = compare.index + compare[0].indexOf(fieldList);

        return (
            code.slice(0, fieldListStart) +
            ' '.repeat(fieldList.length) +
            code.slice(fieldListStart + fieldList.length)
        );
    }

    private maskLabel(code: string): string {
        const label = /^\s*([A-Za-z_]\w*)\s*:/i.exec(code);
        if (!label) {
            return code;
        }

        const labelStart = label.index + label[0].indexOf(label[1]);
        return code.slice(0, labelStart) + ' '.repeat(label[1].length) + code.slice(labelStart + label[1].length);
    }

    private getCallFunctionNameStart(code: string): number | undefined {
        const call = /\bcall\s+([A-Za-z_]\w*)\b/i.exec(code);
        return call ? call.index + call[0].length - call[1].length : undefined;
    }

    private getActivateOperationNameStart(code: string): number | undefined {
        const activateOperation =
            /^\s*activate(?:\s*\/[A-Za-z_]\w*)*\s+.*?\.\s*([A-Za-z_]\w*)\s*\(/i.exec(code);
        return activateOperation
            ? activateOperation.index + activateOperation[0].lastIndexOf(activateOperation[1])
            : undefined;
    }

    private getGotoLabelStart(code: string): number | undefined {
        const goto = /^\s*goto\s+([A-Za-z_]\w*)\b/i.exec(code);
        return goto ? goto.index + goto[0].length - goto[1].length : undefined;
    }

    private getStatementModifierStarts(code: string): number[] {
        const statement = /^\s*([A-Za-z_]\w*)\b/i.exec(code);
        if (!statement || !this.statements.has(statement[1].toLowerCase())) {
            return [];
        }

        const modifier = /\s*\/\s*([A-Za-z_]\w*)\b/gy;
        const starts: number[] = [];
        modifier.lastIndex = statement[0].length;

        let match: RegExpExecArray | null;
        while ((match = modifier.exec(code)) !== null) {
            starts.push(match.index + match[0].lastIndexOf(match[1]));
        }

        return starts;
    }
}

import * as vscode from "vscode";
import { GetUnifaceProcFunctionList } from "./code/getUnifaceProcFunctionList.use.case";
import { GetEntriesList } from "./code/getEntriesList.use.case";
import { GetParametersFromBlock } from "./code/getParametersFromBlock.use.case";
import { GetBlockAroundPostion } from "./code/getBlockAroundPosition.use.case";

export class UnifaceSignatureHelpProvider
    implements vscode.SignatureHelpProvider
{
    provideSignatureHelp(
        document: vscode.TextDocument,
        position: vscode.Position,
        cancellationToken: vscode.CancellationToken,
        context: vscode.SignatureHelpContext
    ): vscode.ProviderResult<vscode.SignatureHelp> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const line = editor.selection.active.line;
        const lineText = editor.document.lineAt(line).text;

        const currentExpression = this.getCurrentExpression(lineText, position);
        if (currentExpression === "") {
            return null;
        }

        const signature = new vscode.SignatureInformation(
            `${currentExpression}()`
        );

        this.updateSignatureDocs(
            document,
            currentExpression,
            lineText,
            signature
        );

        const signatureHelp = new vscode.SignatureHelp();
        signatureHelp.signatures = [signature];
        signatureHelp.activeSignature = 0;
        signatureHelp.activeParameter = this.getActiveParameter(
            document,
            position
        );

        return signatureHelp;
    }

    private updateSignatureDocs(
        document: vscode.TextDocument,
        currentExpression: string,
        textLine: string,
        signatureInformation: vscode.SignatureInformation
    ) {
        if (currentExpression.startsWith("$")) {
            this.updateSignatureForProcFunctionUniface(
                currentExpression,
                signatureInformation
            );
        } else if (textLine.toLowerCase().trim().startsWith("call")) {
            this.updateSignatureForEntries(
                document,
                currentExpression,
                signatureInformation
            );
        }
    }

    private updateSignatureForProcFunctionUniface(
        currentExpression: string,
        signatureInformation: vscode.SignatureInformation
    ) {
        const procFunctions = new GetUnifaceProcFunctionList().execute();
        const procFunction = procFunctions.find(
            (value) => value.name === currentExpression
        );

        if (!procFunction) {
            return null;
        }

        const params = procFunction.params.join(", ");

        signatureInformation.label = `${procFunction.name}(${params})`;
        signatureInformation.documentation = procFunction.docs;

        signatureInformation.parameters = [];
        for (const param of procFunction.params) {
            signatureInformation.parameters.push(
                new vscode.ParameterInformation(param)
            );
        }
    }

    private updateSignatureForEntries(
        document: vscode.TextDocument,
        currentExpression: string,
        signatureInformation: vscode.SignatureInformation
    ) {
        const entries = new GetEntriesList().execute(document);
        const entry = entries.find(
            (value) =>
                value.name.toLowerCase() === currentExpression.toLowerCase()
        );
        if (!entry) {
            return null;
        }

        const position = new vscode.Position(entry.line, 0);

        const block = new GetBlockAroundPostion().execute(document, position);
        if (!block) {
            return null;
        }

        const declaredParameters = new GetParametersFromBlock().execute(block);

        const params = declaredParameters
            .map((declaredVariable) => {
                return declaredVariable.name;
            })
            .join(", ");

        signatureInformation.label = `${entry.name}(${params})`;
        signatureInformation.documentation = "";

        signatureInformation.parameters = [];
        for (const param of declaredParameters) {
            signatureInformation.parameters.push(
                new vscode.ParameterInformation(param.name)
            );
        }
    }

    private getActiveParameter(
        document: vscode.TextDocument,
        position: vscode.Position
    ): number {
        const line = document.lineAt(position.line).text;
        const cursorPos = position.character;

        const textUpToCursor = line.slice(0, cursorPos);

        const openParenIndex = textUpToCursor.lastIndexOf("(");
        const closeParenIndex = line.indexOf(")", openParenIndex);

        if (
            openParenIndex === -1 ||
            cursorPos <= openParenIndex ||
            (closeParenIndex !== -1 && cursorPos > closeParenIndex)
        ) {
            return 0;
        }

        const paramText = textUpToCursor.slice(openParenIndex + 1);
        const commaCount = (paramText.match(/,/g) || []).length;

        return commaCount;
    }

    private getCurrentExpression(
        textLine: string,
        position: vscode.Position
    ): string {
        const textUpToCursor = textLine.slice(0, position.character);

        const entryMatch = RegExp(/call\s+((\w)+)/i).exec(textUpToCursor);
        if (entryMatch?.[1]) {
            return entryMatch[1];
        }

        const procFuncMatch = RegExp(/(\$(\w)+)\s*\(/).exec(textUpToCursor);
        if (procFuncMatch?.[1]) {
            return procFuncMatch[1];
        }

        return "";
    }
}

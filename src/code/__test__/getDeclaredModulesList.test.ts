import * as assert from "node:assert";
import * as vscode from "vscode";
import { GetDeclaredModulesList } from "../getDeclaredModulesList.use.case";

suite("GetDeclaredModulesList", () => {
    test("lists modules when the document has no leading blank line", async () => {
        const document = await vscode.workspace.openTextDocument({
            content: "operation firstOperation\n",
            language: "uniface",
        });

        const modules = new GetDeclaredModulesList().execute(document);

        assert.deepStrictEqual(modules, [
            {
                name: "firstOperation",
                line: 0,
                scriptModuleType: "operation",
            },
        ]);
    });

    test("lists modules when the document starts with a blank line", async () => {
        const document = await vscode.workspace.openTextDocument({
            content: "\nentry firstEntry\nfunction secondFunction\n",
            language: "uniface",
        });

        const modules = new GetDeclaredModulesList().execute(document);

        assert.deepStrictEqual(modules, [
            {
                name: "firstEntry",
                line: 1,
                scriptModuleType: "entry",
            },
            {
                name: "secondFunction",
                line: 2,
                scriptModuleType: "function",
            },
        ]);
    });

    test("ignores module keywords outside the beginning of a line", async () => {
        const document = await vscode.workspace.openTextDocument({
            content: "; entry ignoredEntry\nentry validEntry\n",
            language: "uniface",
        });

        const modules = new GetDeclaredModulesList().execute(document);

        assert.deepStrictEqual(modules, [
            {
                name: "validEntry",
                line: 1,
                scriptModuleType: "entry",
            },
        ]);
    });
});

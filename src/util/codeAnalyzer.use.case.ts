export class CodeAnalyzer {
    public static isComment(lineText: string): boolean {
        return lineText.trim().startsWith(";");
    }
}

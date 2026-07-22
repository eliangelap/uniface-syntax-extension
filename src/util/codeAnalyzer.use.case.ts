export class CodeAnalyzer {
    public static isLineCommented(lineText: string): boolean {
        return lineText.trim().startsWith(';');
    }
}

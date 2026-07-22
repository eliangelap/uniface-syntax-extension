export class GetCurrentDate {
    public execute(): string {
        const date = new Date();
        return date.toISOString().split('T')[0];
    }
}

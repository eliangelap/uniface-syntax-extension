export interface DeclaredItem {
    name: string;
    line: number;
}

export type ScriptModuleType = 'entry' | 'operation' | 'function' | 'trigger';

export interface DeclaredModule extends DeclaredItem {
    scriptModuleType: ScriptModuleType;
}

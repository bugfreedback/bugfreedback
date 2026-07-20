import type { ExportAdapter } from './types.js';
export type AsanaExportAdapterOptions = {
    token: string;
    projectGid: string;
    workspaceGid?: string;
    fetchImpl?: typeof fetch;
};
export declare function createAsanaExportAdapter(options: AsanaExportAdapterOptions): ExportAdapter;

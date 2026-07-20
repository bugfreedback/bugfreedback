import type { ExportAdapter } from './types.js';
export type LinearExportAdapterOptions = {
    apiKey: string;
    teamId: string;
    labelIds?: string[];
    fetchImpl?: typeof fetch;
};
export declare function createLinearExportAdapter(options: LinearExportAdapterOptions): ExportAdapter;

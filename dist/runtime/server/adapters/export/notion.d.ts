import type { ExportAdapter } from './types.js';
export type NotionExportAdapterOptions = {
    token: string;
    databaseId: string;
    fetchImpl?: typeof fetch;
};
export declare function createNotionExportAdapter(options: NotionExportAdapterOptions): ExportAdapter;

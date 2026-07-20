import type { ExportAdapter } from './types.js';
export type TrelloExportAdapterOptions = {
    apiKey: string;
    token: string;
    listId: string;
    fetchImpl?: typeof fetch;
};
export declare function createTrelloExportAdapter(options: TrelloExportAdapterOptions): ExportAdapter;

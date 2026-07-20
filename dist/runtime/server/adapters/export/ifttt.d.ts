import type { ExportAdapter } from './types.js';
export type IftttExportAdapterOptions = {
    eventName: string;
    webhookKey: string;
    fetchImpl?: typeof fetch;
};
export declare function createIftttExportAdapter(options: IftttExportAdapterOptions): ExportAdapter;

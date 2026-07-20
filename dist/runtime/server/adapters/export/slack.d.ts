import type { ExportAdapter } from './types.js';
export type SlackExportAdapterOptions = {
    webhookUrl: string;
    channel?: string;
    fetchImpl?: typeof fetch;
};
export declare function createSlackExportAdapter(options: SlackExportAdapterOptions): ExportAdapter;

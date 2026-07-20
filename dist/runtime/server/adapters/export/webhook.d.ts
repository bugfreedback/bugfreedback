import type { ExportAdapter } from './types.js';
export type WebhookExportAdapterOptions = {
    url: string;
    headers?: Record<string, string>;
    fetchImpl?: typeof fetch;
};
export declare function createWebhookExportAdapter(options: WebhookExportAdapterOptions): ExportAdapter;

import type { ExportAdapter } from './types.js';
export type JiraExportAdapterOptions = {
    baseUrl: string;
    email: string;
    apiToken: string;
    projectKey: string;
    issueType?: string;
    fetchImpl?: typeof fetch;
};
export declare function createJiraExportAdapter(options: JiraExportAdapterOptions): ExportAdapter;

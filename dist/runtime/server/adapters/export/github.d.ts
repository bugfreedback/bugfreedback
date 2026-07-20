import type { ExportAdapter, ExportCreateInput } from './types.js';
export type GithubExportAdapterOptions = {
    token: string;
    owner: string;
    repo: string;
    labels?: string[];
    fetchImpl?: typeof fetch;
};
export declare function buildGithubIssueBody(input: ExportCreateInput): string;
export declare function createGithubExportAdapter(options: GithubExportAdapterOptions): ExportAdapter;

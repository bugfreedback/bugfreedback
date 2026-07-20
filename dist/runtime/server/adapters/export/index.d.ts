import type { BugfreedbackExportOptions } from '../../../../types.js';
import type { ExportAdapter } from './types.js';
export declare function createExportAdapter(options: BugfreedbackExportOptions): ExportAdapter;
export type { ExportAdapter, ExportCreateInput, ExportCreateResult } from './types.js';
export { buildGithubIssueBody } from './github.js';

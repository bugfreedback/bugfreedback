import type { BugfreedbackExportOptions, BugfreedbackStorageOptions } from '../../../types.js';
import type { ExportAdapter } from '../adapters/export/types.js';
import type { StorageAdapter } from '../adapters/storage/types.js';
/** Apply host env overrides so secrets can be injected at runtime (Cloud Run, etc.). */
export declare function resolveStorageOptions(options: BugfreedbackStorageOptions | undefined): BugfreedbackStorageOptions;
export declare function resolveExportOptions(options: BugfreedbackExportOptions | undefined): BugfreedbackExportOptions | null;
export declare function createResolvedStorageAdapter(options: BugfreedbackStorageOptions | undefined): StorageAdapter | null;
export declare function createResolvedExportAdapter(options: BugfreedbackExportOptions | undefined): ExportAdapter;

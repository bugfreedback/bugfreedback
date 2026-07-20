import type { BugfreedbackStorageOptions } from '../../../../types.js';
import type { StorageAdapter } from './types.js';
export declare const DEFAULT_OBJECT_PREFIX = "feedback/";
export declare const OBJECT_ID_LENGTH = 32;
export declare function buildScreenshotObjectKey(prefix?: string): string;
export declare function createStorageAdapter(options: BugfreedbackStorageOptions): StorageAdapter | null;
export declare function resolveObjectPrefix(options: BugfreedbackStorageOptions): string;

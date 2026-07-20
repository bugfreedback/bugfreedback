import { Storage } from '@google-cloud/storage';
import type { StorageAdapter } from './types.js';
export type GcsStorageAdapterOptions = {
    bucket: string;
    storage?: Storage;
};
export declare function createGcsStorageAdapter(options: GcsStorageAdapterOptions): StorageAdapter;

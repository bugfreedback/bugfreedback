import { S3Client } from '@aws-sdk/client-s3';
import type { StorageAdapter } from './types.js';
export type S3StorageAdapterOptions = {
    bucket: string;
    region?: string;
    endpoint?: string;
    forcePathStyle?: boolean;
    publicBaseUrl?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    client?: S3Client;
};
export declare function buildS3PublicUrl(options: S3StorageAdapterOptions, objectKey: string): string;
export declare function createS3StorageAdapter(options: S3StorageAdapterOptions): StorageAdapter;

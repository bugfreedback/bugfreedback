import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { StorageAdapter, StorageUploadInput, StorageUploadResult } from './types'

export type S3StorageAdapterOptions = {
  bucket: string
  region?: string
  endpoint?: string
  forcePathStyle?: boolean
  publicBaseUrl?: string
  accessKeyId?: string
  secretAccessKey?: string
  client?: S3Client
}

export function buildS3PublicUrl(options: S3StorageAdapterOptions, objectKey: string): string {
  if (options.publicBaseUrl?.trim()) {
    return `${options.publicBaseUrl.replace(/\/$/, '')}/${objectKey}`
  }
  if (options.endpoint?.trim()) {
    const base = options.endpoint.replace(/\/$/, '')
    return `${base}/${options.bucket}/${objectKey}`
  }
  const region = options.region?.trim() || 'us-east-1'
  return `https://${options.bucket}.s3.${region}.amazonaws.com/${objectKey}`
}

export function createS3StorageAdapter(options: S3StorageAdapterOptions): StorageAdapter {
  const bucket = options.bucket.trim()
  if (!bucket) {
    throw new Error('S3 storage bucket is not configured')
  }

  const client
    = options.client
      ?? new S3Client({
        region: options.region || 'us-east-1',
        endpoint: options.endpoint || undefined,
        forcePathStyle: options.forcePathStyle ?? Boolean(options.endpoint),
        credentials:
          options.accessKeyId && options.secretAccessKey
            ? {
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey,
              }
            : undefined,
      })

  return {
    async upload(input: StorageUploadInput): Promise<StorageUploadResult> {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: input.objectKey,
          Body: input.data,
          ContentType: input.contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      )

      return {
        objectKey: input.objectKey,
        publicUrl: buildS3PublicUrl({ ...options, bucket }, input.objectKey),
      }
    },
  }
}

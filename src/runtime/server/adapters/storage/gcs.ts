import { Storage } from '@google-cloud/storage'
import type { StorageAdapter, StorageUploadInput, StorageUploadResult } from './types'

export type GcsStorageAdapterOptions = {
  bucket: string
  storage?: Storage
}

export function createGcsStorageAdapter(options: GcsStorageAdapterOptions): StorageAdapter {
  const bucketName = options.bucket.trim()
  if (!bucketName) {
    throw new Error('GCS storage bucket is not configured')
  }

  return {
    async upload(input: StorageUploadInput): Promise<StorageUploadResult> {
      const storage = options.storage ?? new Storage()
      const file = storage.bucket(bucketName).file(input.objectKey)

      await file.save(input.data, {
        contentType: input.contentType,
        resumable: false,
        metadata: {
          cacheControl: 'public, max-age=31536000, immutable',
        },
      })

      return {
        objectKey: input.objectKey,
        publicUrl: `https://storage.googleapis.com/${bucketName}/${input.objectKey}`,
      }
    },
  }
}

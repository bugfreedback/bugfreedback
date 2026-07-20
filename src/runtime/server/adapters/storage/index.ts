import { nanoid } from 'nanoid'
import type { BugfreedbackStorageOptions } from '../../../../types'
import { createGcsStorageAdapter } from './gcs'
import { createS3StorageAdapter } from './s3'
import type { StorageAdapter } from './types'

export const DEFAULT_OBJECT_PREFIX = 'feedback/'
export const OBJECT_ID_LENGTH = 32

export function buildScreenshotObjectKey(prefix: string = DEFAULT_OBJECT_PREFIX): string {
  const normalized = prefix.endsWith('/') ? prefix : `${prefix}/`
  return `${normalized}${nanoid(OBJECT_ID_LENGTH)}.png`
}

export function createStorageAdapter(
  options: BugfreedbackStorageOptions,
): StorageAdapter | null {
  if (options.provider === 'none') {
    return null
  }
  if (options.provider === 'gcs') {
    return createGcsStorageAdapter({ bucket: options.bucket })
  }
  if (options.provider === 's3') {
    return createS3StorageAdapter({
      bucket: options.bucket,
      region: options.region,
      endpoint: options.endpoint,
      forcePathStyle: options.forcePathStyle,
      publicBaseUrl: options.publicBaseUrl,
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
    })
  }
  return null
}

export function resolveObjectPrefix(options: BugfreedbackStorageOptions): string {
  if (options.provider === 'gcs' || options.provider === 's3') {
    return options.objectPrefix ?? DEFAULT_OBJECT_PREFIX
  }
  return DEFAULT_OBJECT_PREFIX
}

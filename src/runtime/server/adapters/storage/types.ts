export type StorageUploadInput = {
  data: Buffer
  contentType: string
  objectKey: string
}

export type StorageUploadResult = {
  publicUrl: string
  objectKey: string
}

export interface StorageAdapter {
  upload(input: StorageUploadInput): Promise<StorageUploadResult>
}

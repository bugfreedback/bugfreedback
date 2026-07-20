import { Storage } from "@google-cloud/storage";
export function createGcsStorageAdapter(options) {
  const bucketName = options.bucket.trim();
  if (!bucketName) {
    throw new Error("GCS storage bucket is not configured");
  }
  return {
    async upload(input) {
      const storage = options.storage ?? new Storage();
      const file = storage.bucket(bucketName).file(input.objectKey);
      await file.save(input.data, {
        contentType: input.contentType,
        resumable: false,
        metadata: {
          cacheControl: "public, max-age=31536000, immutable"
        }
      });
      return {
        objectKey: input.objectKey,
        publicUrl: `https://storage.googleapis.com/${bucketName}/${input.objectKey}`
      };
    }
  };
}

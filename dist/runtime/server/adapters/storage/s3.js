import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
export function buildS3PublicUrl(options, objectKey) {
  if (options.publicBaseUrl?.trim()) {
    return `${options.publicBaseUrl.replace(/\/$/, "")}/${objectKey}`;
  }
  if (options.endpoint?.trim()) {
    const base = options.endpoint.replace(/\/$/, "");
    return `${base}/${options.bucket}/${objectKey}`;
  }
  const region = options.region?.trim() || "us-east-1";
  return `https://${options.bucket}.s3.${region}.amazonaws.com/${objectKey}`;
}
export function createS3StorageAdapter(options) {
  const bucket = options.bucket.trim();
  if (!bucket) {
    throw new Error("S3 storage bucket is not configured");
  }
  const client = options.client ?? new S3Client({
    region: options.region || "us-east-1",
    endpoint: options.endpoint || void 0,
    forcePathStyle: options.forcePathStyle ?? Boolean(options.endpoint),
    credentials: options.accessKeyId && options.secretAccessKey ? {
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey
    } : void 0
  });
  return {
    async upload(input) {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: input.objectKey,
          Body: input.data,
          ContentType: input.contentType,
          CacheControl: "public, max-age=31536000, immutable"
        })
      );
      return {
        objectKey: input.objectKey,
        publicUrl: buildS3PublicUrl({ ...options, bucket }, input.objectKey)
      };
    }
  };
}

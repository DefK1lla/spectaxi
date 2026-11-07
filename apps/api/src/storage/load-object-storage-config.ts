export type ObjectStorageConfig = {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  forcePathStyle: boolean;
};

/**
 * S3-compatible object storage (Neon Object Storage, Cloudflare R2,
 * Selectel / Yandex / Timeweb S3, …). Not tied to Amazon AWS as a vendor —
 * only the S3 API + `@aws-sdk/client-s3` with a custom endpoint.
 */
export function loadObjectStorageConfig(
  env: NodeJS.ProcessEnv = process.env,
): ObjectStorageConfig | null {
  const endpoint = env.S3_ENDPOINT?.trim();
  const accessKeyId = env.S3_KEY?.trim();
  const secretAccessKey = env.S3_SECRET?.trim();
  const bucket = env.S3_BUCKET?.trim();

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  const forcePathStyleRaw = env.S3_FORCE_PATH_STYLE?.trim().toLowerCase();
  const forcePathStyle =
    forcePathStyleRaw === undefined || forcePathStyleRaw === ""
      ? true
      : forcePathStyleRaw !== "false" && forcePathStyleRaw !== "0";

  return {
    endpoint,
    accessKeyId,
    secretAccessKey,
    region: env.S3_REGION?.trim() || "auto",
    bucket,
    forcePathStyle,
  };
}

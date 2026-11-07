import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import {
  loadObjectStorageConfig,
  type ObjectStorageConfig,
} from "../../load-object-storage-config";
import type { ObjectStorage, PutObjectInput } from "../../object-storage.port";

/**
 * S3-совместимый адаптер (Neon Object Storage, R2, Selectel, Yandex, …).
 * Env: `S3_*`. Другой вендор = новый класс-адаптер + bind в StorageModule.
 */
@Injectable()
export class S3ObjectStorageAdapter implements ObjectStorage {
  private readonly config: ObjectStorageConfig | null;
  private readonly client: S3Client | null;

  constructor() {
    this.config = loadObjectStorageConfig();
    this.client = this.config
      ? new S3Client({
          endpoint: this.config.endpoint,
          region: this.config.region,
          forcePathStyle: this.config.forcePathStyle,
          credentials: {
            accessKeyId: this.config.accessKeyId,
            secretAccessKey: this.config.secretAccessKey,
          },
        })
      : null;
  }

  isConfigured(): boolean {
    return this.client !== null && this.config !== null;
  }

  async putObject(input: PutObjectInput): Promise<void> {
    const { client, config } = this.requireReady();
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
      }),
    );
  }

  async getSignedGetUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const { client, config } = this.requireReady();
    return getSignedUrl(
      client,
      new GetObjectCommand({ Bucket: config.bucket, Key: key }),
      { expiresIn: expiresInSeconds },
    );
  }

  private requireReady(): {
    client: S3Client;
    config: ObjectStorageConfig;
  } {
    if (!this.config || !this.client) {
      throw new Error(
        "Object storage is not configured. Set S3_ENDPOINT, S3_KEY, S3_SECRET, S3_BUCKET.",
      );
    }
    return { client: this.client, config: this.config };
  }
}

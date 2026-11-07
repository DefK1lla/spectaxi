import type { Readable } from "node:stream";

export const OBJECT_STORAGE = Symbol("OBJECT_STORAGE");

export type PutObjectInput = {
  key: string;
  body: Buffer | Uint8Array | string | Readable;
  contentType?: string;
};

/**
 * Port for file storage. Domains inject `OBJECT_STORAGE` — never S3/AWS types.
 * Swap adapters (S3-compatible, local disk, …) in StorageModule only.
 */
export interface ObjectStorage {
  isConfigured(): boolean;
  putObject(input: PutObjectInput): Promise<void>;
  getSignedGetUrl(key: string, expiresInSeconds?: number): Promise<string>;
}

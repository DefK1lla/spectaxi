import type { Readable } from "node:stream";

export const OBJECT_STORAGE = Symbol("OBJECT_STORAGE");

export type PutObjectInput = {
  key: string;
  body: Buffer | Uint8Array | string | Readable;
  contentType?: string;
};

/**
 * Порт файлового хранилища. Домены инжектят `OBJECT_STORAGE` — без типов S3/AWS.
 * Смена адаптера (S3-compatible, локальный диск, …) только в StorageModule.
 */
export interface ObjectStorage {
  isConfigured(): boolean;
  putObject(input: PutObjectInput): Promise<void>;
  getSignedGetUrl(key: string, expiresInSeconds?: number): Promise<string>;
}

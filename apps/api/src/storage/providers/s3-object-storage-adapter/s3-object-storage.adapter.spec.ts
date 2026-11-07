import { afterEach, describe, expect, it } from "vitest";
import { S3ObjectStorageAdapter } from "./s3-object-storage.adapter";

const ENV_KEYS = [
  "S3_ENDPOINT",
  "S3_KEY",
  "S3_SECRET",
  "S3_BUCKET",
  "S3_REGION",
  "S3_FORCE_PATH_STYLE",
] as const;

describe("S3ObjectStorageAdapter", () => {
  const snapshot = new Map<string, string | undefined>();

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const value = snapshot.get(key);
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    snapshot.clear();
  });

  function rememberEnv(): void {
    for (const key of ENV_KEYS) {
      snapshot.set(key, process.env[key]);
    }
  }

  it("isConfigured is false without env", async () => {
    rememberEnv();
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
    const storage = new S3ObjectStorageAdapter();
    expect(storage.isConfigured()).toBe(false);
    await expect(storage.putObject({ key: "x", body: "y" })).rejects.toThrow(
      /not configured/i,
    );
  });

  it("isConfigured is true when S3_* are set", () => {
    rememberEnv();
    process.env.S3_ENDPOINT = "https://example.storage";
    process.env.S3_KEY = "key";
    process.env.S3_SECRET = "secret";
    process.env.S3_BUCKET = "assets";
    process.env.S3_REGION = "eu-central-1";
    process.env.S3_FORCE_PATH_STYLE = "true";

    const storage = new S3ObjectStorageAdapter();
    expect(storage.isConfigured()).toBe(true);
  });
});

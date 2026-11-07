import { describe, expect, it } from "vitest";
import { loadObjectStorageConfig } from "./load-object-storage-config";

describe("loadObjectStorageConfig", () => {
  it("возвращает null, если нет обязательных переменных", () => {
    expect(loadObjectStorageConfig({})).toBeNull();
    expect(
      loadObjectStorageConfig({
        S3_ENDPOINT: "https://example.storage",
        S3_KEY: "key",
      }),
    ).toBeNull();
  });

  it("мапит S3_* env (Neon / R2 / …)", () => {
    expect(
      loadObjectStorageConfig({
        S3_ENDPOINT: "https://example.storage/ ",
        S3_KEY: " nak ",
        S3_SECRET: " nsk ",
        S3_REGION: "eu-central-1",
        S3_BUCKET: "assets",
        S3_FORCE_PATH_STYLE: "true",
      }),
    ).toEqual({
      endpoint: "https://example.storage/",
      accessKeyId: "nak",
      secretAccessKey: "nsk",
      region: "eu-central-1",
      bucket: "assets",
      forcePathStyle: true,
    });
  });

  it("по умолчанию forcePathStyle=true и region=auto", () => {
    expect(
      loadObjectStorageConfig({
        S3_ENDPOINT: "https://example.storage",
        S3_KEY: "k",
        S3_SECRET: "s",
        S3_BUCKET: "assets",
      }),
    ).toMatchObject({
      region: "auto",
      forcePathStyle: true,
    });
  });

  it("выключает forcePathStyle при явном false", () => {
    expect(
      loadObjectStorageConfig({
        S3_ENDPOINT: "https://example.storage",
        S3_KEY: "k",
        S3_SECRET: "s",
        S3_BUCKET: "assets",
        S3_FORCE_PATH_STYLE: "false",
      })?.forcePathStyle,
    ).toBe(false);
  });
});

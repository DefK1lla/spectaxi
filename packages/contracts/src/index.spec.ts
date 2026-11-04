import { describe, expect, it } from "vitest";
import { healthResponseSchema, readyResponseSchema } from "./index";

describe("healthResponseSchema", () => {
  it("принимает status ok", () => {
    expect(healthResponseSchema.parse({ status: "ok" })).toEqual({
      status: "ok",
    });
  });

  it("отклоняет неизвестный status", () => {
    expect(() => healthResponseSchema.parse({ status: "down" })).toThrow();
  });
});

describe("readyResponseSchema", () => {
  it("совпадает по форме с health", () => {
    expect(readyResponseSchema.parse({ status: "ok" })).toEqual({
      status: "ok",
    });
  });
});

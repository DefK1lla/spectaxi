import { describe, expect, it } from "vitest";
import { APP_BRAND } from "./brand";

describe("APP_BRAND", () => {
  it("равен SpexTaxi", () => {
    expect(APP_BRAND).toBe("SpexTaxi");
  });
});

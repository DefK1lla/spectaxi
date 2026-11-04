import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";
import { AdminController } from "./admin.controller";

describe("AdminController", () => {
  it("getHealth возвращает ok", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AdminController],
    }).compile();

    const controller = moduleRef.get(AdminController);

    expect(controller.getHealth()).toEqual({ status: "ok" });
  });
});

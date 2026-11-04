import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";
import { PrismaService } from "../../../../prisma/prisma.service";
import { createPrismaMock } from "../../../../prisma/prisma.mock";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("getHealth возвращает ok", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: createPrismaMock() }],
    }).compile();

    const controller = moduleRef.get(HealthController);

    expect(controller.getHealth()).toEqual({ status: "ok" });
  });

  it("getReady возвращает ok (скелет без проверки БД)", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: createPrismaMock() }],
    }).compile();

    const controller = moduleRef.get(HealthController);

    expect(controller.getReady()).toEqual({ status: "ok" });
  });
});

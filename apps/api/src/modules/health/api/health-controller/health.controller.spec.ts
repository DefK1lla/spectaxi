import { ServiceUnavailableException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { describe, expect, it, vi } from "vitest";
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

  it("getReady возвращает ok при живой БД", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: createPrismaMock() }],
    }).compile();

    const controller = moduleRef.get(HealthController);

    await expect(controller.getReady()).resolves.toEqual({ status: "ok" });
  });

  it("getReady отдаёт 503 если БД недоступна", async () => {
    const prisma = createPrismaMock();
    prisma.$queryRaw = vi.fn().mockRejectedValue(new Error("db down"));

    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    const controller = moduleRef.get(HealthController);

    await expect(controller.getReady()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});

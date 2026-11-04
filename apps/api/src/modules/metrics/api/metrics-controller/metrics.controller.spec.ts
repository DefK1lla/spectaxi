import {
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterEach, describe, expect, it } from "vitest";
import { MetricsService } from "../../services/metrics-service/metrics.service";
import { MetricsController } from "./metrics.controller";

describe("MetricsController", () => {
  afterEach(() => {
    delete process.env.METRICS_TOKEN;
  });

  it("503 если METRICS_TOKEN не задан", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [MetricsService],
    }).compile();

    const controller = moduleRef.get(MetricsController);
    await expect(controller.getMetrics("Bearer x")).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it("401 при неверном токене", async () => {
    process.env.METRICS_TOKEN = "secret";
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [MetricsService],
    }).compile();
    moduleRef.get(MetricsService).onModuleInit();

    const controller = moduleRef.get(MetricsController);
    await expect(controller.getMetrics("Bearer wrong")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("возвращает prometheus text при верном токене", async () => {
    process.env.METRICS_TOKEN = "secret";
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [MetricsService],
    }).compile();
    moduleRef.get(MetricsService).onModuleInit();

    const controller = moduleRef.get(MetricsController);
    const body = await controller.getMetrics("Bearer secret");
    expect(body).toContain("spectaxi_api_up");
  });
});

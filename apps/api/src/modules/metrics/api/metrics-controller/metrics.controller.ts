import {
  Controller,
  Get,
  Header,
  Headers,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MetricsService } from "../../services/metrics-service/metrics.service";

/**
 * Endpoint scrape Prometheus. Нужен `Authorization: Bearer <METRICS_TOKEN>`.
 * Без METRICS_TOKEN — 503 (неверная конфигурация), а не открытые метрики.
 */
@ApiTags("metrics")
@Controller()
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get("metrics")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Метрики Prometheus (Bearer METRICS_TOKEN)",
  })
  @Header("Content-Type", "text/plain; version=0.0.4; charset=utf-8")
  async getMetrics(
    @Headers("authorization") authorization: string | undefined,
  ): Promise<string> {
    const token = process.env.METRICS_TOKEN?.trim();
    if (!token) {
      throw new ServiceUnavailableException("METRICS_TOKEN is not configured");
    }

    const expected = `Bearer ${token}`;
    if (authorization !== expected) {
      throw new UnauthorizedException();
    }

    return this.metrics.renderPrometheus();
  }
}

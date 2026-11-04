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
 * Prometheus scrape endpoint. Requires `Authorization: Bearer <METRICS_TOKEN>`.
 * If METRICS_TOKEN is unset, returns 503 (misconfigured) rather than open metrics.
 */
@ApiTags("metrics")
@Controller()
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get("metrics")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Prometheus metrics (Bearer METRICS_TOKEN)" })
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

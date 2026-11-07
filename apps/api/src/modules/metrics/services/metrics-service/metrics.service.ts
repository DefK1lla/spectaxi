import { Injectable, OnModuleInit } from "@nestjs/common";
import { collectDefaultMetrics, Gauge, Registry } from "prom-client";

/**
 * Prometheus registry (изолированный на инстанс сервиса — удобно в тестах).
 * Стандартные Node metrics + gauge spectaxi_api_up.
 */
@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry = new Registry();
  private upGauge?: Gauge<string>;

  onModuleInit(): void {
    collectDefaultMetrics({ register: this.registry });
    this.upGauge = new Gauge({
      name: "spectaxi_api_up",
      help: "1 if the API process is up",
      registers: [this.registry],
    });
    this.upGauge.set(1);
  }

  async renderPrometheus(): Promise<string> {
    this.upGauge?.set(1);
    return this.registry.metrics();
  }
}

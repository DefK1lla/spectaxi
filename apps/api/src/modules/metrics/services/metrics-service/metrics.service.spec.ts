import { describe, expect, it } from "vitest";
import { MetricsService } from "./metrics.service";

describe("MetricsService", () => {
  it("отдаёт gauge spectaxi_api_up и default metrics", async () => {
    const service = new MetricsService();
    service.onModuleInit();
    const body = await service.renderPrometheus();
    expect(body).toContain("spectaxi_api_up");
    expect(body).toMatch(/process_cpu|nodejs_/);
  });
});

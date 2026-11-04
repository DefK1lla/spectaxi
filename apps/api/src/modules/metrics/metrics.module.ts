import { Module } from "@nestjs/common";
import { MetricsController } from "./api/metrics-controller";
import { MetricsService } from "./services/metrics-service";

@Module({
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}

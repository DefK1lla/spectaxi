import { Module } from "@nestjs/common";
import { HealthController } from "./api/health-controller/health.controller";

@Module({
  controllers: [HealthController],
})
export class HealthModule {}

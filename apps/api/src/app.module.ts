import { Module } from "@nestjs/common";
import { AdminModule } from "./modules/admin/admin.module";
import { HealthModule } from "./modules/health/health.module";
import { MetricsModule } from "./modules/metrics/metrics.module";
// import { PrismaModule } from "./prisma/prisma.module";
import { StorageModule } from "./storage";

@Module({
  imports: [
    HealthModule,
    AdminModule,
    MetricsModule,
    StorageModule,
    // Включайте, когда задан DATABASE_URL и Nest должен использовать Prisma:
    // PrismaModule,
  ],
})
export class AppModule {}

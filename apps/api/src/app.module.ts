import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
// import { PrismaModule } from "./prisma/prisma.module";

@Module({
  // Включайте, когда задан DATABASE_URL и Nest должен использовать Prisma:
  // imports: [PrismaModule],
  controllers: [HealthController],
})
export class AppModule {}

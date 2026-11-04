import { Controller, Get } from "@nestjs/common";
import {
  healthResponseSchema,
  readyResponseSchema,
  type HealthResponse,
  type ReadyResponse,
} from "@spectaxi/contracts";
// import { PrismaService } from "./prisma/prisma.service";

@Controller()
export class HealthController {
  // constructor(private readonly prisma: PrismaService) {}

  /** Liveness: процесс жив. Зависимости не проверяем. */
  @Get("health")
  getHealth(): HealthResponse {
    return healthResponseSchema.parse({ status: "ok" });
  }

  /**
   * Readiness: зависимости доступны.
   * Скелет: всегда ok (подключение Prisma закомментировано).
   * После включения PrismaModule — раскомментируйте проверку БД ниже.
   */
  @Get("ready")
  getReady(): ReadyResponse {
    // try {
    //   await this.prisma.$queryRaw`SELECT 1`;
    // } catch {
    //   throw new ServiceUnavailableException({ status: "error" });
    // }

    return readyResponseSchema.parse({ status: "ok" });
  }
}

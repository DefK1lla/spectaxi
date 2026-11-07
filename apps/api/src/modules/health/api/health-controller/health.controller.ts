import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  healthResponseSchema,
  readyResponseSchema,
  type HealthResponse,
  type ReadyResponse,
} from "@spectaxi/contracts";
// import { PrismaService } from "../../../../prisma/prisma.service";

@ApiTags("health")
@Controller()
export class HealthController {
  // constructor(private readonly prisma: PrismaService) {}

  /** Liveness: процесс жив. Зависимости не проверяем. */
  @Get("health")
  @ApiOperation({ summary: "Liveness: процесс жив" })
  getHealth(): HealthResponse {
    return healthResponseSchema.parse({ status: "ok" });
  }

  /**
   * Readiness: зависимости доступны.
   * Скелет: всегда ok (подключение Prisma закомментировано).
   * После включения PrismaModule — раскомментируйте проверку БД ниже.
   * См. docs/tasks/11-migrations-deploy.md и 04-database-url.md.
   */
  @Get("ready")
  @ApiOperation({
    summary: "Readiness: зависимости (после включения Prisma — проверка БД)",
  })
  getReady(): ReadyResponse {
    // try {
    //   await this.prisma.$queryRaw`SELECT 1`;
    // } catch {
    //   throw new ServiceUnavailableException({ status: "error" });
    // }

    return readyResponseSchema.parse({ status: "ok" });
  }
}

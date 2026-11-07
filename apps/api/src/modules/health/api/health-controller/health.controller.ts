import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  healthResponseSchema,
  readyResponseSchema,
  type HealthResponse,
  type ReadyResponse,
} from "@spectaxi/contracts";
import { PrismaService } from "../../../../prisma/prisma.service";

@ApiTags("health")
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /** Liveness: процесс жив. Зависимости не проверяем. */
  @Get("health")
  @ApiOperation({ summary: "Liveness: процесс жив" })
  getHealth(): HealthResponse {
    return healthResponseSchema.parse({ status: "ok" });
  }

  /**
   * Readiness: зависимости доступны (сейчас — БД через Prisma).
   * См. docs/tasks/11-migrations-deploy.md и 04-database-url.md.
   */
  @Get("ready")
  @ApiOperation({ summary: "Readiness: зависимости (проверка БД)" })
  async getReady(): Promise<ReadyResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({ status: "error" });
    }

    return readyResponseSchema.parse({ status: "ok" });
  }
}

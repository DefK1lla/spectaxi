import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

/**
 * Каркас админской HTTP-поверхности (`/api/v1/admin/*`).
 * Сюда не переносить доменную логику (заказы, лицензии, споры) —
 * она в modules/<domain>; админ-ручки тонкие или живут в домене
 * (*-admin-controller). См. docs/BACKEND_STRUCTURE.md.
 */
@ApiTags("admin")
@Controller("admin")
export class AdminController {
  @Get("health")
  @ApiOperation({ summary: "Заглушка health админ-поверхности" })
  getHealth(): { status: "ok" } {
    return { status: "ok" };
  }
}

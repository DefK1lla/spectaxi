import { Module } from "@nestjs/common";
import { AdminController } from "./api/admin-controller/admin.controller";

/**
 * Каркас админ-поверхности (позже: admin JWT/TOTP, guards).
 * Не склад доменной логики — см. docs/BACKEND_STRUCTURE.md.
 */
@Module({
  controllers: [AdminController],
})
export class AdminModule {}

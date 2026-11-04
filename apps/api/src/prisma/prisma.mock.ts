import { vi } from "vitest";

/**
 * Заготовка мока PrismaService для unit-тестов Nest.
 * Без реальной БД: подставляйте через `{ provide: PrismaService, useValue: createPrismaMock() }`.
 */
export function createPrismaMock() {
  return {
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
    $queryRaw: vi.fn().mockResolvedValue([{ ok: 1 }]),
  };
}

export type PrismaMock = ReturnType<typeof createPrismaMock>;

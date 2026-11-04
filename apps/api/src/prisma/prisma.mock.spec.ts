import { describe, expect, it } from "vitest";
import { createPrismaMock } from "./prisma.mock";

describe("createPrismaMock", () => {
  it("отдаёт заглушки $connect / $queryRaw без обращения к БД", async () => {
    const prisma = createPrismaMock();

    await expect(prisma.$connect()).resolves.toBeUndefined();
    await expect(prisma.$queryRaw`SELECT 1`).resolves.toEqual([{ ok: 1 }]);
    expect(prisma.$connect).toHaveBeenCalledOnce();
    expect(prisma.$queryRaw).toHaveBeenCalledOnce();
  });
});

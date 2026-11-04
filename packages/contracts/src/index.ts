import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

/** Тот же контракт, что у health; для readiness-пробы. */
export const readyResponseSchema = healthResponseSchema;

export type ReadyResponse = z.infer<typeof readyResponseSchema>;

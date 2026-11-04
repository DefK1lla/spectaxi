import "reflect-metadata";
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { enableCors } from "./common/cors/enable-cors";
import { setupOpenApi } from "./openapi/setup-openapi";
import { initSentry, setupSentryNestFilter } from "./sentry/sentry.init";

// Корневой .env, затем apps/api/.env поверх (локальный API важнее).
loadEnv({ path: path.resolve(__dirname, "../../../.env") });
loadEnv({ path: path.resolve(__dirname, "../.env"), override: true });

async function bootstrap() {
  await initSentry();

  const app = await NestFactory.create(AppModule);
  await setupSentryNestFilter(app);
  enableCors(app);
  app.setGlobalPrefix("api/v1");
  setupOpenApi(app);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api/v1`);
  if (process.env.ENABLE_OPENAPI === "true") {
    console.log(`OpenAPI UI: http://localhost:${port}/api/docs`);
  }
}

void bootstrap();

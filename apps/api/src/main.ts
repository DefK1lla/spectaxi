import "reflect-metadata";
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// Корневой .env, затем apps/api/.env поверх (локальный API важнее).
loadEnv({ path: path.resolve(__dirname, "../../../.env") });
loadEnv({ path: path.resolve(__dirname, "../.env"), override: true });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api/v1`);
}

void bootstrap();

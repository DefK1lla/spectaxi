import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/**
 * Подготовка OpenAPI/Swagger. Включается только при ENABLE_OPENAPI=true.
 * Спека растёт по мере `@ApiTags` / `@Api*` на контроллерах.
 */
export function setupOpenApi(app: INestApplication): void {
  if (process.env.ENABLE_OPENAPI !== "true") {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle("SpexTaxi API")
    .setDescription(
      "MVP REST API (`/api/v1`). Черновик — контракты также в @spectaxi/contracts.",
    )
    .setVersion("0.0.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
}

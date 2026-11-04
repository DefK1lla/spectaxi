import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/**
 * OpenAPI/Swagger prep. Enabled only when ENABLE_OPENAPI=true.
 * Spec grows as controllers get @ApiTags / @Api* decorators.
 */
export function setupOpenApi(app: INestApplication): void {
  if (process.env.ENABLE_OPENAPI !== "true") {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle("SpexTaxi API")
    .setDescription(
      "MVP REST API (`/api/v1`). Draft — contracts also in @spectaxi/contracts.",
    )
    .setVersion("0.0.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
}

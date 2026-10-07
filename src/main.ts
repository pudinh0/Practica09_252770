import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { DominioExceptionFilter } from "./inscripciones/dominio/errores";
import { LoggingInterceptor } from "./comun/interceptores/loggin.interceptor";
import { SobreInterceptor } from "./comun/interceptores/sobre.interceptor";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guards";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:5173"],
    exposedHeaders: ["Location", "X-Request-Id"],
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.useGlobalFilters(new DominioExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor(), new SobreInterceptor());
  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector));
  const config = new DocumentBuilder()
    .setTitle("API del Gimnasio") // titulo que sale arriba de /docs
    .setVersion("1.0")
    .addBearerAuth() // agrega el boton Authorize
    .addSecurityRequirements("bearer") // pone el candado en todas las rutas
    .build();
  const documento = SwaggerModule.createDocument(app, config); // recorre controllers y DTO
  SwaggerModule.setup("docs", app, documento); // lo publica en /docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: ["http://localhost:8080", process.env.FRONTEND_URL],
    credentials: true,
  });
  const config = new DocumentBuilder().setTitle("NestJS API");
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup("api", app, document);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap().then(() => console.log("Server is running on port 3000"));

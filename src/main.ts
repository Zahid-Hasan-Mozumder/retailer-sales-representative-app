import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  // Load environment variables from .env file
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  setupSwagger(app);

  // Enable the global ValidationPipe with transform option
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

function setupSwagger(app: any): void {
  const config = new DocumentBuilder()
    .setTitle('Retailer Sales Representative API')
    .setDescription('API documentation for the Retailer Sales Representative APP')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document, {
    customSiteTitle: 'Retailer Sales Representative API',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      persistAuthorization: true,
    },
  });
}

bootstrap();

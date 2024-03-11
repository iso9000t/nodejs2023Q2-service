import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { load } from 'js-yaml';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 4000); // Explicitly type your config retrieval

  // Elegant path construction and async YAML loading
  const apiSpecPath = join(__dirname, '..', 'doc', 'api.yaml');
  const yamlContents = await readFile(apiSpecPath, 'utf8');
  const openAPIDocument = load(yamlContents) as OpenAPIObject;

  SwaggerModule.setup('api-docs', app, openAPIDocument); // Changed the Swagger UI path

  // Applying validation globally with detailed options for demonstration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Listening on the configured port and improved logging
  await app.listen(port, () => {
    console.info(`Server works at http://localhost:${port}`);
    console.info(
      `📚 Swagger UI available at http://localhost:${port}/api-docs`,
    );
  });
}

bootstrap();

import * as fs from 'fs';

import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as yaml from 'js-yaml';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  const config = new DocumentBuilder()
    .setTitle('Nest Articles App')
    .setDescription('RESTful API with NestJS and TypeORM')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`, 'Dev Server')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  fs.writeFileSync('./swagger.yaml', yaml.dump(document));

  await app.listen(port);
}
bootstrap();

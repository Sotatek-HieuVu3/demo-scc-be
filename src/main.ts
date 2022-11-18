import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import responseTime from 'response-time';

import { AppModule } from './app.module';
import { HEADER_KEY } from './auth/constants/strategy.constant';
import { VALIDATION_PIPE_OPTIONS } from './shared/constants';
import { RequestIdMiddleware } from './shared/middleware/request-id/request-id.middleware';
import { RedisIoAdapter } from './socket/adapter/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);
  app.enableCors();
  app.use(
    responseTime({
      header: 'x-response-time',
    }),
  );

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('Stream2Earn API')
    .setDescription('Stream2Earn API')
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .addApiKey(
      {
        name: HEADER_KEY.API_KEY,
        in: 'header',
        type: 'apiKey',
      },
      HEADER_KEY.API_KEY,
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const redisIoAdapter = new RedisIoAdapter(app, configService);
  await redisIoAdapter.connectToRedis();
  await app.listen(port);
}
bootstrap();

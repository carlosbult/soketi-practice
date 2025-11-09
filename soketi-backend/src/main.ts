import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyRawBody from 'fastify-raw-body';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const fastifyAdapter = new FastifyAdapter();
  const fastifyInstance = fastifyAdapter.getInstance();

  fastifyInstance.register(fastifyRawBody, {
    field: 'rawBody',
    global: true,
    encoding: 'utf-8',
    runFirst: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

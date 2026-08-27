import 'reflect-metadata';
import type { Handler, HandlerResponse } from '@netlify/functions';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import serverless from 'serverless-http';
import { AppModule } from '../../src/app.module';

type ServerlessHandler = ReturnType<typeof serverless>;
let cachedHandler: ServerlessHandler | undefined;

async function getHandler(): Promise<ServerlessHandler> {
  if (cachedHandler) return cachedHandler;

  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.init();

  cachedHandler = serverless(app.getHttpAdapter().getInstance());
  return cachedHandler;
}

export const handler: Handler = async (event, context) => {
  try {
    const nestHandler = await getHandler();
    return await nestHandler(event, context) as HandlerResponse;
  } catch (error) {
    console.error('No fue posible iniciar la API de FinLex.', error);
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ message: 'No fue posible iniciar el servicio. Revise los registros de la Function api.' }),
    };
  }
};

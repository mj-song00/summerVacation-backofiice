import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-excption.filter';
import * as fs from 'fs';

const port = process.env.PORT;
const httpsOptions = {
  key: fs.readFileSync(
    '/etc/letsencrypt/live/https://summervacation.site/privkey.pem',
  ),
  cert: fs.readFileSync(
    '/etc/letsencrypt/live/https://summervacation.site/fullchain.pem',
  ),
  passphrase: process.env.PASS_KEY,
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.enableCors({
    credentials: true,
    origin: '*',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.enableCors();
  
  const port = process.env.PORT || 5004;
  await app.listen(port);
  console.log(`Employee service is running on port ${port}`);
}
bootstrap();
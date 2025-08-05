import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // GraphQL handles validation differently, so we disable global validation
  // app.useGlobalPipes(new ValidationPipe({
  //   transform: true,
  //   whitelist: true,
  //   forbidNonWhitelisted: false,
  // }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`GraphQL Gateway running on port ${port}`);
  console.log(`GraphQL Playground: http://localhost:${port}/graphql`);
}
bootstrap();
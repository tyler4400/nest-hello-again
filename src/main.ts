import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,  // 关闭整个nestjs日志
    // logger: ['error', 'warn'], // 启用特定日志级别
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

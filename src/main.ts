import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { GlobalExceptionFilter } from './exception-filter/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,  // 关闭整个nestjs日志
    // logger: ['error', 'warn'], // 启用特定日志级别
  });

  // 应用全局异常过滤器
  // app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

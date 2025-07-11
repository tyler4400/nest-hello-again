import { Module } from '@nestjs/common';
import { ExceptionController } from './exception.controller';
import { GlobalExceptionFilter } from '../exception-filter/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      // 在模块中注册全局过滤器
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  controllers: [ExceptionController],
})
export class ExceptionModule {}

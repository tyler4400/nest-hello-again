import {
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseFilters,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';
import { PinoLogger } from 'nestjs-pino';
import { HttpExceptionFilter } from '../exception-filter/http-exception.filter';

// @UseFilters(HttpExceptionFilter) // 捕获整个controller的http异常
@Controller('exception')
export class ExceptionController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
    private readonly pinoLogger: PinoLogger,
  ) {
    this.pinoLogger.info('异常模块集成成功');
  }

  @Post('/')
  testHttpException() {
    this.winstonLogger.error('This is a test winston error');
    this.pinoLogger.error('This is a test pino error');
    throw new HttpException(
      'This is a test HTTP exception',
      HttpStatus.BAD_REQUEST,
    );
  }

  @UseFilters(HttpExceptionFilter)
  @Post('/filter')
  testExceptionFilter() {
    throw new HttpException('方法级异常过滤器', HttpStatus.EXPECTATION_FAILED);
  }
}

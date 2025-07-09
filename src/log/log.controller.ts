import { Controller, Logger, Get } from '@nestjs/common';
import { LogService } from './log.service';
import { PinoLogger } from 'nestjs-pino';

@Controller('log')
export class LogController {
  private logger = new Logger(LogController.name);

  constructor(
    private readonly logService: LogService,
    private readonly pinoLogger: PinoLogger,
  ) {}

  @Get('/')
  testDefaultLogger() {
    this.logger.log('请求logger成功');
    return this.logService.hello();
  }

  @Get('/pino')
  testPinoLogger() {
    this.pinoLogger.info('请求nestjs-pino logger成功'); // 注释掉pino-log也会自动打印 懒人必备
    return '请求nestjs-pino logger成功';
  }
}

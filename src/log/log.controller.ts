import { Controller, Logger, Get } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('log')
export class LogController {
  private logger = new Logger(LogController.name);

  constructor(private readonly logService: LogService) {}

  @Get()
  testDefaultLogger() {
    this.logger.log('请求logger成功');
    return this.logService.hello();
  }
}

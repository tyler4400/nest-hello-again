import { Controller, Logger, Get, Inject } from '@nestjs/common';
import { LogService } from './log.service';
import { PinoLogger } from 'nestjs-pino';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Controller('log')
export class LogController {
  private nestLogger = new Logger(LogController.name);

  constructor(
    private readonly logService: LogService,
    private readonly pinoLogger: PinoLogger,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
  ) {
    this.nestLogger.log('日志模块集成成功');
  }

  @Get('/')
  testDefaultLogger() {
    this.nestLogger.log('请求logger成功');
    return this.logService.hello();
  }

  @Get('/pino')
  testPinoLogger() {
    this.pinoLogger.info('请求nestjs-pino logger成功'); // 注释掉pino-log也会自动打印 懒人必备
    return '请求nestjs-pino logger成功';
  }

  @Get('/winston')
  testWinstonLogger() {
    // 测试不同的日志级别
    this.winstonLogger.info('测试 Winston Logger - 功能丰富的日志库');
    this.winstonLogger.debug('Winston debug information', {
      userId: 67890,
      action: 'test_winston',
      metadata: { browser: 'Chrome', ip: '192.168.1.1' },
    });
    this.winstonLogger.warn('这是一个警告消息', {
      warning: 'Resource usage high',
    });

    return {
      message: '请求 Winston logger 成功',
      features: 'Winston provides rich customization options!',
    };
  }

  @Get('/winston/error')
  testWinstonError() {
    try {
      // 模拟一个错误
      throw new Error('这是一个测试错误');
    } catch (error) {
      // Winston 会自动处理错误堆栈跟踪
      this.winstonLogger.error('捕获到错误', {
        error: (error as Error).message,
        stack: (error as Error).stack,
        endpoint: '/winston/error',
        timestamp: new Date().toISOString(),
      });

      return {
        message: '错误已记录到 Winston',
        errorLogged: true,
      };
    }
  }

  @Get('/compare')
  compareLoggers() {
    const startTime = Date.now();

    // 同时使用三种日志库记录相同信息
    const logData = {
      userId: 999,
      action: 'compare_loggers',
      timestamp: new Date().toISOString(),
    };

    // NestJS 内置 Logger
    this.nestLogger.log('日志库性能对比测试', JSON.stringify(logData));

    // Pino Logger
    this.pinoLogger.info('Performance comparison test', logData);

    // Winston Logger
    this.winstonLogger.info('Logger performance comparison', logData);

    const endTime = Date.now();

    return {
      message: '三种日志库对比测试完成',
      executionTime: `${endTime - startTime}ms`,
      loggers: ['NestJS Built-in', 'Pino', 'Winston'],
      recommendation: 'Check logs folder to see different outputs',
    };
  }
}

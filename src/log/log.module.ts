import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'node:path';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    /**
     * 这部分学习 nestjs-pino 模块
     * https://github.com/iamolegga/nestjs-pino
     */
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            process.env.NODE_ENV === 'development' // 本地测试的时候可以把这里打开
              ? {
                  level: 'info',
                  target: 'pino-pretty',
                  options: {
                    colorize: true, // 格式化 更好看一些
                  },
                }
              : {
                  level: 'info',
                  target: 'pino-roll',
                  // 下面这个配置是生产环境启用日志存储的相关的配置
                  options: {
                    file: join('logs', 'pino-log.txt'),
                    frequency: 'daily', // 打印周期 hourly
                    size: '10m', // 单个文件大小， 如果超出了就新建文件
                    mkdir: true,
                  },
                },
          ],
        },
      },
    }),

    /**
     * Winston 日志库集成学习
     * 提供更灵活的日志配置和多种传输方式
     */
    WinstonModule.forRoot({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',

      // 自定义日志格式
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        // 添加自定义格式化
        // winston.format.printf(
        //   ({ level, message, timestamp, stack, ...meta }) => {
        //     let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        //     if (stack) {
        //       log += `\n${stack}`;
        //     }
        //     if (Object.keys(meta).length > 0) {
        //       log += `\nMeta: ${JSON.stringify(meta, null, 2)}`;
        //     }
        //     return log;
        //   },
        // ),
      ),
      // 配置多种传输方式
      transports: [
        // 控制台输出（开发环境启用彩色）
        new winston.transports.Console({
          format:
            process.env.NODE_ENV === 'development'
              ? winston.format.combine(
                  winston.format.colorize(),
                  winston.format.simple(),
                )
              : winston.format.json(),
        }),

        // 错误日志文件
        new winston.transports.File({
          filename: join('logs', 'winston-error.log'),
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),

        // 所有日志文件
        new winston.transports.File({
          filename: join('logs', 'winston-combined.log'),
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 15,
        }),

        // events - archive rotate
        new winston.transports.DailyRotateFile({
          level: 'warn',
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: 'info',
          dirname: 'logs',
          filename: 'info-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        }),

        // 开发环境额外的调试日志
        ...(process.env.NODE_ENV === 'development'
          ? [
              new winston.transports.File({
                filename: join('logs', 'winston-debug.log'),
                level: 'debug',
                format: winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.json(),
                  winston.format.prettyPrint(),
                ),
              }),
            ]
          : []),
      ],

      // 处理未捕获的异常
      exceptionHandlers: [
        new winston.transports.File({
          filename: join('logs', 'winston-exceptions.log'),
        }),
      ],

      // 处理未捕获的 Promise 拒绝
      rejectionHandlers: [
        new winston.transports.File({
          filename: join('logs', 'winston-rejections.log'),
        }),
      ],
    }),
  ],
  providers: [LogService],
  controllers: [LogController],
})
export class LogModule {}

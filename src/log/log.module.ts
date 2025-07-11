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
     *
     * 运行后， logs 目录将包含：
     * logs/
     * ├── winston-error.log              # 错误日志
     * ├── winston-combined.log           # 综合日志
     * ├── winston-debug.log              # 调试日志（仅开发环境）
     * ├── winston-exceptions.log         # 未捕获异常
     * ├── winston-rejections.log         # Promise 拒绝
     * ├── application-2024-01-20-14.log  # 按小时轮转的应用日志
     * ├── application-2024-01-20-15.log.gz  # 压缩的旧日志
     * ├── info-2024-01-20-14.log         # 信息级别轮转日志
     * └── pino-log.txt                   # Pino 日志
     */
    WinstonModule.forRoot({
      /**
       * 开发环境: debug - 显示所有级别的日志（error, warn, info, debug）
       * 生产环境: info - 只显示 info 及以上级别的日志
       *
       * Winston 日志级别优先级（从高到低
       * error: 0    // 错误信息
       * warn: 1     // 警告信息
       * info: 2     // 一般信息
       * http: 3     // HTTP 请求信息
       * verbose: 4  // 详细信息
       * debug: 5    // 调试信息
       * silly: 6    // 最详细的调试信息
       */
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',

      // 自定义日志格式
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }), // 为错误对象添加完整的堆栈跟踪信息
        winston.format.json(), // 将日志输出为 JSON 格式，便于机器解析
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
        // 开发环境: 彩色简单格式，便于阅读
        // 生产环境: JSON 格式，便于日志收集工具处理
        new winston.transports.Console({
          format:
            process.env.NODE_ENV === 'development'
              ? winston.format.combine(
                  winston.format.colorize(),
                  winston.format.simple(),
                )
              : winston.format.json(),
        }),

        /**
         * 只记录 error 级别的日志
         * 文件大小限制：5MB
         * 最大文件数：10个（超过后删除最旧的）
         * 路径：logs/winston-error.log
         */
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

        /**
         * 记录所有级别的日志
         * 最大文件数：15个
         */
        new winston.transports.File({
          filename: join('logs', 'winston-combined.log'),
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 15,
        }),

        /**
         * 按日期轮转的日志文件:
         * level: 'warn': 只记录 warn 及以上级别的日志
         * filename: 'application-%DATE%.log': 文件名包含日期
         * datePattern: 'YYYY-MM-DD-HH': 按小时轮转（每小时生成新文件）
         * zippedArchive: true: 旧文件自动压缩为 .gz 格式
         * maxSize: '20m': 单文件最大 20MB
         * maxFiles: '14d': 保留 14 天的日志文件
         */
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
                  winston.format.prettyPrint(), // 美化 JSON 输出，便于阅读
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

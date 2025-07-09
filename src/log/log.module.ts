import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'node:path';

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
  ],
  providers: [LogService],
  controllers: [LogController],
})
export class LogModule {}

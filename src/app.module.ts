import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import * as Joi from 'joi';
// import * as dotenv from 'dotenv';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 配置全局
      // envFilePath: ['.env.development', '.env.production'], // 如果一个变量在多个文件中被找到，则以第一个为准
      // envFilePath: `.env.${process.env.NODE_ENV}`, // 根据当前环境变量加载env文件
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // 根据当前环境变量加载env文件, 最后的.env为默认回退文件
      // ignoreEnvFile: true, // 禁止加载所有env文件了
      // load: [() => dotenv.config({ path: '.env' })], // 加载默认common的env文件
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_URL: Joi.string().domain(),
        DB_HOST: Joi.string().ip(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

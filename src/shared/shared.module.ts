import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { configModuleOptions } from './configs/module-options';
import { QUEUE_NAME } from './constants';
import { DatabaseModule } from './database/database.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AppLoggerModule } from './logger/logger.module';
import { QueueModule } from './queue.module';
import { RedisService } from './redis/redis.service';
import { MultiLanguageService } from './services/multi-language.service';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    // MongooseModule.forRoot('mongodb://localhost:27017/test'),
    DatabaseModule,
    AppLoggerModule,
    QueueModule,
    BullModule.registerQueue({
      name: QUEUE_NAME.SOCKET,
    }),
  ],
  exports: [
    AppLoggerModule,
    ConfigModule,

    // DatabaseModule,
    RedisService,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },

    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    MultiLanguageService,
    RedisService,
  ],
})
export class SharedModule {}

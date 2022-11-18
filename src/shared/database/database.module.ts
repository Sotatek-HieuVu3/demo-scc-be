import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseProviders } from './database.provider';
// import {
//   initializeTransactionalContext,
//   patchTypeORMRepositoryWithBaseRepository,
// } from 'typeorm-transactional-cls-hooked';

// initializeTransactionalContext(); // Initialize cls-hooked
// patchTypeORMRepositoryWithBaseRepository(); // patch Repository with BaseRepository.

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/test',
      }),
    }),
  ],
})
export class DatabaseModule {}

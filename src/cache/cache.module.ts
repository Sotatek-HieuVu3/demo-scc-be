import { Global, Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [SharedModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class MyCacheModule {}

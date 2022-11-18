import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';

import { AppGateway } from './app.gateway';

@Module({
  imports: [SharedModule, AuthModule],
  exports: [AppGateway],
  providers: [AppGateway],
})
export class AppSocketModule {}

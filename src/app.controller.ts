import { Controller, Get } from '@nestjs/common';

import { AppLogger } from './shared/logger/logger.service';
import { ReqContext } from './shared/request-context/req-context.decorator';
import { RequestContext } from './shared/request-context/request-context.dto';

@Controller()
export class AppController {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AppController.name);
  }

  @Get()
  getHello(@ReqContext() ctx: RequestContext): string {
    this.logger.log(ctx, `${this.getHello.name} was called`);
    return 'Hello World!';
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppLogger } from 'src/shared/logger/logger.service';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

import { CreateUserInput } from '../dtos/create-user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UserService,
  ) {
    this.logger.setContext(UserController.name);
  }

  @Post()
  async createUser(
    @ReqContext() ctx: RequestContext,
    @Body() createUserDto: CreateUserInput,
  ): Promise<any> {
    this.logger.log(ctx, `${this.createUser.name} was called`);
    console.log(createUserDto);
    const createdUser = await this.userService.create(createUserDto);
    return createdUser;
  }
}

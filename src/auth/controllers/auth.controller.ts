import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerCommonResponse } from 'src/shared/decorators/response-swagger.decorator';

import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { HEADER_KEY } from '../constants/strategy.constant';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import { AuthTokenOutput } from '../dtos/auth-token-output.dto';
import { RequestMailOtpInput } from '../dtos/request-mail-otp-input.dto';
import { VerifyOtpInput } from '../dtos/verify-otp-input.dto';
import { AuthHeaderApiKeyGuard } from '../guards/header-api-key-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
@ApiSecurity(HEADER_KEY.API_KEY)
@UseGuards(AuthHeaderApiKeyGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login API',
  })
  @SwaggerCommonResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @ReqContext() ctx: RequestContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() loginInput: LoginInput,
  ): Promise<BaseApiResponse<AuthTokenOutput | any>> {
    this.logger.log(ctx, `${this.login.name} was called`);
    console.log(loginInput);
    const data = await this.authService.login(ctx, loginInput);
    return { data, meta: {} };
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token API',
  })
  @SwaggerCommonResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @ReqContext() ctx: RequestContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: RefreshTokenInput,
  ): Promise<BaseApiResponse<AuthTokenOutput | any>> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`);
    const authToken = '';
    // const authToken = await this.authService.refreshToken(ctx);
    return { data: authToken, meta: {} };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout API',
  })
  @SwaggerCommonResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(Boolean),
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async logout(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<boolean>> {
    // const data = await this.authService.logout(ctx);
    const data = true;
    return {
      data,
      meta: {},
    };
  }
}

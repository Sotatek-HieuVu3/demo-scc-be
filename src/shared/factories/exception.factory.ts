import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ErrorCode } from '../constants/error-code';
import { ErrorMessage } from '../constants/error-message';

export class ExceptionFactory {
  static create(
    key: ErrorCode,
    info?: any,
  ): BadRequestException | ForbiddenException | UnauthorizedException {
    switch (key) {
      case ErrorCode.USER_BALANCE_NOT_ENOUGH: {
        return new BadRequestException({
          message: ErrorMessage.USER_BALANCE.NOT_ENOUGH_BALANCE,
          code: ErrorCode.USER_BALANCE_NOT_ENOUGH,
        });
      }
      case ErrorCode.AUTH_INVALID_EMAIL: {
        return new BadRequestException({
          code: ErrorCode.AUTH_INVALID_EMAIL,
          message: ErrorMessage.AUTH.INVALID_EMAIL,
        });
      }
      case ErrorCode.USER_WALLET_NO_WALLET_CONNECTED: {
        return new BadRequestException({
          message: ErrorMessage.USER_WALLET.NO_WALLET_CONNECTED,
          code: ErrorCode.USER_WALLET_NO_WALLET_CONNECTED,
        });
      }
      case ErrorCode.USER_WALLET_USER_WALLET_NOT_FOUND:
        return new BadRequestException({
          code: ErrorCode.USER_WALLET_USER_WALLET_NOT_FOUND,
          message: ErrorMessage.USER_WALLET.USER_WALLET_NOT_FOUND,
        });
      case ErrorCode.USER_WALLET_INVALID_WALLET_ADDRESS:
        return new BadRequestException({
          message: ErrorMessage.USER_WALLET.INVALID_WALLET_ADDRESS,
          code: ErrorCode.USER_WALLET_INVALID_WALLET_ADDRESS,
        });
      case ErrorCode.USER_WALLET_ALREADY_CONNECTED_WALLET_ADDRESS:
        return new BadRequestException({
          message: ErrorMessage.USER_WALLET.ALREADY_CONNECTED_WALLET_ADDRESS,
          code: ErrorCode.USER_WALLET_ALREADY_CONNECTED_WALLET_ADDRESS,
        });
      case ErrorCode.TOKEN_INVALID_TOKEN:
        return new BadRequestException({
          message: ErrorMessage.TOKEN.INVALID_TOKEN,
          code: ErrorCode.TOKEN_INVALID_TOKEN,
        });

      case ErrorCode.AUTH_TOKEN_INVALID_REFRESH_TOKEN:
        return new ForbiddenException({
          message: `${info || ErrorMessage.AUTH.INVALID_REFRESH_TOKEN}`,
          code: ErrorCode.AUTH_TOKEN_INVALID_REFRESH_TOKEN,
        });
      case ErrorCode.AUTH_TOKEN_INVALID_ACCESS_TOKEN:
        return new ForbiddenException({
          message: ErrorMessage.AUTH.INVALID_ACCESS_TOKEN,
          code: ErrorCode.AUTH_TOKEN_INVALID_ACCESS_TOKEN,
        });
      case ErrorCode.AUTH_ROLE_INVALID:
        return new UnauthorizedException({
          message: info || ErrorMessage.AUTH.INVALID_ROLE,
          code: ErrorCode.AUTH_ROLE_INVALID,
        });
      case ErrorCode.USER_ID_NOT_FOUND:
        return new ForbiddenException({
          message: ErrorMessage.AUTH.INVALID_USER_ID,
          code: ErrorCode.USER_ID_NOT_FOUND,
        });
    }
  }
}

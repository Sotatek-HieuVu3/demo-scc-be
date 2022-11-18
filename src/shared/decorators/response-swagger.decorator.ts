import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { BaseApiErrorResponse } from '../dtos/base-api-response.dto';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const SwaggerCommonResponse = ({
  status = HttpStatus.OK,
  type,
}: {
  status?: number;
  type: any;
}) => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request',
      type: BaseApiErrorResponse,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
      type: BaseApiErrorResponse,
    }),
    ApiResponse({
      status,
      type,
    }),
  );
};

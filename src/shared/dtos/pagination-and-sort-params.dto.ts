import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { ESortOrder, ESortType } from '../interfaces/common.interface';
import { PaginationParamsDto } from './pagination-params.dto';

export class PaginationAndSortParamsDto extends PaginationParamsDto {
  @IsOptional()
  @ApiPropertyOptional({
    enum: ESortType,
  })
  sort: ESortType;

  @IsOptional()
  @ApiPropertyOptional({
    enum: ESortOrder,
  })
  order: ESortOrder;
}

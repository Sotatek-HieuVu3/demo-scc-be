import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class LevelRangeDto {
  @ApiPropertyOptional({
    name: 'level[min]',
  })
  @Type(() => Number)
  @IsNumber()
  min: number;

  @ApiPropertyOptional({
    name: 'level[max]',
  })
  @IsNumber()
  @Type(() => Number)
  max: number;
}

export class MintedTimeRangeDto {
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({
    name: 'mintedTime[min]',
  })
  min: number;

  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({
    name: 'mintedTime[max]',
  })
  max: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyWalletAddressInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  signature: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;
}

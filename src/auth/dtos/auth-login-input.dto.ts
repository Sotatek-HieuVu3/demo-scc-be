import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'test@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}

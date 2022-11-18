import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpInput {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mail otp',
    example: '123456',
  })
  @Type(() => Number)
  otpCode: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'test@example.com',
  })
  email: string;
}

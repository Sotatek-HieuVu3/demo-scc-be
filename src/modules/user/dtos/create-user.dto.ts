import { IsString } from 'class-validator';

export class CreateUserInput {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  walletAddress: string;
}

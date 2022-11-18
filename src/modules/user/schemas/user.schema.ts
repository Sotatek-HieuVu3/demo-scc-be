import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: number;

  @Prop({ name: 'wallet_address' })
  walletAddress: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

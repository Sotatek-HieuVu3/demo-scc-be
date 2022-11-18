import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserInput } from '../dtos/create-user.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserInput): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec();
  }
}

import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userService: Model<User>,
  ) {}
  async findByEmail(email: string): Promise<HydratedDocument<User> | null> {
    const emailExisting = await this.userService.findOne({ email }).exec();

    return emailExisting;
  }

  async findById(id: string): Promise<HydratedDocument<User> | null> {
    const user = await this.userService.findById(id).exec();

    return user;
  }
}

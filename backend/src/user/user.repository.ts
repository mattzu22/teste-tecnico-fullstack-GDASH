import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(
    userCreateData: Pick<User, 'name' | 'email' | 'passwordHash'>,
  ): Promise<HydratedDocument<User>> {
    const createdUser = await this.userModel.create(userCreateData);
    return createdUser;
  }
  async findAll(): Promise<HydratedDocument<User>[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async findByEmail(email: string): Promise<HydratedDocument<User> | null> {
    const emailExisting = await this.userModel.findOne({ email }).exec();

    return emailExisting;
  }

  async findById(id: string): Promise<HydratedDocument<User> | null> {
    const user = await this.userModel.findById(id).exec();

    return user;
  }

  async updateOne(
    id: string,
    updateData: Partial<UpdateUserDto & { passwordHash?: string }>,
  ): Promise<void> {
    await this.userModel.updateOne({ _id: id }, updateData).exec();
  }

  async deleteOne(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }
}

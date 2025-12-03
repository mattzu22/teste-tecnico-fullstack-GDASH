import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

import { Seeder } from 'nestjs-seeder';
import { BcryptService } from '../../auth/hashing/bcrypt.service';

@Injectable()
export class UserSeed implements Seeder {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly bcryptService: BcryptService,
  ) {}
  drop(): Promise<any> {
    return this.userModel.deleteMany({});
  }
  async seed(): Promise<any> {
    await this.userModel.deleteMany({});

    const passwordHash = await this.bcryptService.hashPassword('Admin@123');

    const users = [
      {
        name: 'Admin',
        email: 'admin@example.com',
        passwordHash: passwordHash,
      },
    ];

    return this.userModel.insertMany(users);
  }
}

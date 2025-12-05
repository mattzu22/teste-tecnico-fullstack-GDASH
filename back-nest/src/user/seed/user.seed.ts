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

    const passwordHash = await this.bcryptService.hashPassword(
      process.env.PASSWORD_DEFAULT || '123456',
    );
    const userName = process.env.USERNAME_DEFAULT || 'Admin';
    const email = process.env.EMAIL_DEFAULT || 'admin@example.com';

    const users = [
      {
        name: userName,
        email: email,
        passwordHash: passwordHash,
      },
    ];

    return this.userModel.insertMany(users);
  }
}

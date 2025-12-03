import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { LoggerService } from 'src/common/services/logger.service';
import { UserRepository } from './user.repository';
// import { AuthModule } from 'src/auth/auth.module';
import { HashingModule } from 'src/auth/hashing/hashing.module';
import { UserSeed } from './seed/user.seed';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HashingModule,
  ],
  controllers: [UserController],
  providers: [UserService, LoggerService, UserRepository, UserSeed],
  exports: [UserService],
})
export class UserModule {}

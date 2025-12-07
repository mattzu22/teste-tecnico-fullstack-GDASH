import { Global, Module } from '@nestjs/common';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { LoggerService } from 'src/common/services/logger.service';
import { UserModule } from 'src/user/user.module';
import { HashingModule } from './hashing/hashing.module';
@Global()
@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UserModule,
    HashingModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LoggerService],
  exports: [ConfigModule, JwtModule],
})
export class AuthModule {}

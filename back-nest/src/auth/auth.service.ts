import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/schemas/user.schema';
import { HydratedDocument } from 'mongoose';
import { LoggerService } from 'src/common/services/logger.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { BcryptService } from './hashing/bcrypt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LoggerService,
    private readonly bcryptService: BcryptService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async login(body: LoginDto) {
    const { email, password } = body;

    const user: HydratedDocument<User> | null =
      await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais incorretas');
    }
    this.logger.log(`Found user: ${user._id.toString()}`);

    const comparePassword = await this.bcryptService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('Credenciais incorretas');
    }

    return this.createToken(user);
  }

  async createToken(user: HydratedDocument<User>): Promise<{ token: string }> {
    try {
      const token = await this.jwtService.signAsync(
        {
          sub: user._id,
          name: user.name,
        },
        {
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.expiresIn,
        },
      );

      if (!token || token === null) {
        throw new UnauthorizedException('Falha ao criar token.');
      }

      this.logger.log(`Created token: ${token}`);

      return { token };
    } catch (error) {
      const err = error as Error;

      this.logger.error(`Failed to create token: ${err.message}`, {
        stack: err.stack,
      });

      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new InternalServerErrorException(
        'Falha ao criar token.',
        err.message,
      );
    }
  }
}

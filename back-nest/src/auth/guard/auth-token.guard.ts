import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/common/services/logger.service';
import { UserService } from 'src/user/user.service';

interface TokenProps {
  sub: string;
  name: string;
  iat: number;
  exp: number;
}
@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    try {
      const { exp, iat, name, sub }: TokenProps =
        await this.jwtService.verifyAsync(token, this.jwtConfiguration);

      const user = await this.userService.findById(sub);

      this.logger.log(`Verified token for user: ${user.name}`);

      request['tokenPayload'] = {
        exp,
        iat,
        name,
        sub,
      };
    } catch (error) {
      const err = error as Error;

      this.logger.error(`Failed to verify token: ${err.message}`, {
        stack: err.stack,
      });

      if (err.name === 'NotFoundException') {
        throw new UnauthorizedException('Usuário do token não encontrado.');
      }

      if (
        err.name === 'JsonWebTokenError' ||
        err.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Token inválido ou expirado.');
      }

      throw new UnauthorizedException('Falha na autenticação.', err.message);
    }

    return true;
  }
}

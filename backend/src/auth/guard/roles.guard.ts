import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { User } from '../../user/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuário não encontrado na requisição.');
    }

    const hasRole = () =>
      user.roles.some((role) => requiredRoles.includes(role));

    if (user && user.roles && hasRole()) {
      return true;
    }
    throw new ForbiddenException(
      'Você não tem permissão para acessar este recurso.',
    );
  }
}

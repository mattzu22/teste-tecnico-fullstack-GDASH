import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Realiza o login de um usuário',
    description:
      'Autentica um usuário a partir do email e senha, retornando um token de acesso (JWT) em caso de sucesso.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais (email e senha) para autenticação do usuário.',
  })
  @ApiResponse({
    status: 201,
    description: 'Autenticação bem-sucedida. Retorna o token de acesso.',
    schema: {
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais incorretas.' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}

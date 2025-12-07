import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@ApiTags('Usuários')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo usuário',
    description: 'Registra um novo usuário no sistema.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados necessários para a criação do usuário.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso. Retorna o ID do novo usuário.',
    schema: {
      properties: {
        message: { type: 'string', example: 'Usuário criado' },
        userId: { type: 'string', example: '64b8f0c2e1d3c2a5f6b7c8d9' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Campos obrigatórios ausentes: email, nome ou senha.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito. O email fornecido já está registrado.',
  })
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualiza um usuário existente',
    description:
      'Atualiza os dados de um usuário existente, como nome, email ou senha.',
  })
  @ApiBody({
    type: UpdateUserDto,
    description:
      'Campos a serem atualizados. Para alterar a senha, a senha atual e a nova devem ser fornecidas.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do usuário a ser atualizado.',
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({
    status: 409,
    description:
      'Conflito. A senha atual está incorreta ou a nova senha não foi fornecida ao tentar alterar a senha.',
  })
  update(@Body() body: UpdateUserDto, @Param('id') id: string) {
    return this.userService.update(body, id);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({
    summary: 'Lista todos os usuários',
    description:
      'Retorna uma lista com os dados públicos de todos os usuários cadastrados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os usuários retornada com sucesso.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '64b8f0c2e1d3c2a5f6b7c8d9' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'example@example.com' },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Nenhum usuário encontrado.' })
  list() {
    return this.userService.list();
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta um usuário',
    description: 'Remove um usuário do sistema com base no seu ID.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do usuário a ser deletado.',
  })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}

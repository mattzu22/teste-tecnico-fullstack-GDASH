import type {
  CreateUserProps,
  CreateUserResponse,
  User,
  UpdateUserProps,
  UpdateUserResponse,
  DeleteUserResponse,
  ListUsersResponse,
} from '@/interfaces/User';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export async function createUser({
  name,
  email,
  password,
  confirmPassword,
}: CreateUserProps): Promise<CreateUserResponse | undefined> {
  try {
    if (password === confirmPassword) {
      const response = await api.post('/user', {
        name,
        email,
        password,
      });

      const message = response.data.message;
      const status = response.status;

      if (status === 201) {
        toast.success(message);
      }

      return { status, message };
    } else {
      toast.error('As senhas não coincidem.');
    }
  } catch (error: Error | any) {
    if (error.response) {
      const message = error.response.data.message;

      toast.error(message);
    } else {
      toast.error('Não foi possível criar uma conta.');
    }
  }
}

export async function listUsers(): Promise<ListUsersResponse | undefined> {
  try {
    const response = await api.get('/user');
    const message = response.data.message || 'Usuários buscados com sucesso.';
    const status = response.status;
    const users: User[] = response.data;

    if (status === 200) {
      toast.success(message);
    }

    return { status, message, users };
  } catch (error: Error | any) {
    if (error.response) {
      const message = error.response.data.message;
      toast.error(message);
    } else {
      toast.error('Não foi possível buscar os usuários.');
    }
  }
}

export async function updateUser({
  id,
  name,
  email,
  password,
  newPassword,
}: UpdateUserProps): Promise<UpdateUserResponse | undefined> {
  try {
    const dataUpdated = {
      name,
      email,
      password,
      newPassword,
    };

    const response = await api.patch(`/user/${id}`, dataUpdated);
    const message = response.data.message;
    const status = response.status;

    if (status === 200) {
      toast.success(message);
    }

    return { status, message };
  } catch (error: Error | any) {
    if (error.response) {
      const message = error.response.data.message;
      toast.error(message);
    } else {
      toast.error('Não foi possível atualizar o usuário.');
    }
  }
}

export async function deleteUser(
  id: string,
): Promise<DeleteUserResponse | undefined> {
  try {
    const response = await api.delete(`/user/${id}`);
    const message = response.data.message;
    const status = response.status;

    if (status === 200) {
      toast.success(message);
    }

    return { status, message };
  } catch (error: Error | any) {
    if (error.response) {
      const message = error.response.data.message;
      toast.error(message);
    } else {
      toast.error('Não foi possível deletar o usuário.');
    }
  }
}

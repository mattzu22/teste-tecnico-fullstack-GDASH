import type { CreateUserProps, CreateUserResponse } from '@/interfaces/User';
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
      const response = await api.post('/user/create', {
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

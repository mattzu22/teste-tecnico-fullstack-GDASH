import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/auth';
import type { UseAuthProps } from '@/interfaces/Auth';
import type { UpdateUserResponse } from '@/interfaces/User';
import { UpdateSchema, type UpdateFormData } from '@/lib/auth-schema';
import { updateUser } from '@/service/userService';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

export const FormProfile = () => {
  const form = useForm<UpdateFormData>({
    resolver: zodResolver(UpdateSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      newPassword: '',
    },
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);
  const { user } = useAuth() as UseAuthProps;

  const onSubmit = async (values: UpdateFormData): Promise<void> => {
    const { name, email, password, newPassword } = values;

    if (!user) {
      toast.error('Usuário não está autenticado.');
      return;
    }

    const payload: any = { id: user.sub };

    if (name && name.trim() !== '') payload.name = name;
    if (email && email.trim() !== '') payload.email = email;
    if (password && password.trim() !== '') payload.password = password;
    if (newPassword && newPassword.trim() !== '')
      payload.newPassword = newPassword;

    const { status } = (await updateUser(payload)) as UpdateUserResponse;

    if (status === 404) {
      toast.error('usuário nao encontrado');
    }
  };

  const onErrorSubmit = (errors: FieldErrors<UpdateFormData>): void => {
    for (const field in errors) {
      const errorMessage = (errors as any)[field]?.message;
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onErrorSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  type="name"
                  autoComplete="name"
                  placeholder="Nome"
                  className="block w-full rounded-md border-0 bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary ring-slate-700 sm:text-sm sm:leading-6"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className="block w-full rounded-md border-0 bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary ring-slate-700 sm:text-sm sm:leading-6"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha Antiga</FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    type={isVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Sua senha"
                    className="block w-full rounded-md border-0 bg-white/5 px-3 py-2.5shadow-sm ring-1 ring-inset  placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary text-white ring-slate-700 sm:text-sm sm:leading-6"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <Eye size={17} className="text-slate-400" />
                    ) : (
                      <EyeOff size={17} className="text-slate-400" />
                    )}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Nova senha</FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={isVisibleConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-Password"
                    placeholder="Nova senha"
                    className="block w-full rounded-md border-0 bg-white/5 px-3 py-2.5shadow-sm ring-1 ring-inset  placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary text-white ring-slate-700 sm:text-sm sm:leading-6"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5"
                    onClick={() =>
                      setIsVisibleConfirmPassword(!isVisibleConfirmPassword)
                    }
                  >
                    {isVisibleConfirmPassword ? (
                      <Eye size={17} className="text-slate-400" />
                    ) : (
                      <EyeOff size={17} className="text-slate-400" />
                    )}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Atualizar'
          )}
        </Button>
      </form>
    </Form>
  );
};

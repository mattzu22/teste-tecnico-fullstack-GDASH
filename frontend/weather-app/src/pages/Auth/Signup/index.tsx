import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

import { toast, Toaster } from 'sonner';
import { SignupSchema, type SignupFormData } from '@/lib/auth-schema';
import { useNavigate } from 'react-router';
import { createUser } from '@/service/userService';
import { HeaderAuth } from '../components/layout/Header';
import type { CreateUserResponse } from '@/interfaces/User';
import { useState } from 'react';

export default function Signup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);
  const navigate = useNavigate();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupFormData): Promise<void> => {
    const { name, email, password, confirmPassword } = values;

    const { status } = (await createUser({
      name,
      email,
      password,
      confirmPassword,
    })) as CreateUserResponse;

    if (status === 201) {
      navigate('/');
    }
  };

  const onErrorSubmit = (errors: FieldErrors<typeof SignupSchema>): void => {
    for (const field in errors) {
      const errorMessage = errors[field as keyof typeof errors]?.message;
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark">
      <Toaster />
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <HeaderAuth
          title="Crie sua conta"
          subtitle="Junte-se a nós e comece já!"
        />

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
                  <FormLabel>Senha</FormLabel>

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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Confirme sua senha
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={isVisibleConfirmPassword ? 'text' : 'password'}
                        autoComplete="confirm-Password"
                        placeholder="Confirme sua senha"
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
                'Cadastrar'
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-400">
            Já é membro?{' '}
            <a
              href="/"
              className="font-semibold leading-6 hover:text-primary/90 text-primary"
            >
              Entrar
            </a>
          </p>
        </Form>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
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

import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/auth';

import { toast, Toaster } from 'sonner';
import { SigninSchema, type SigninFormData } from '@/lib/auth-schema';
import { useNavigate } from 'react-router';
import { type UseAuthProps } from '@/interfaces/Auth';
import { HeaderAuth } from '../components/layout/Header';

export default function Signin() {
  const { login, message, status } = useAuth() as UseAuthProps;
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SigninFormData>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (status >= 201 && status < 300) {
      toast.success('Login bem-sucedido!');
      navigate('/dashboard');
    } else if (message) {
      toast.error(message);
    }
  }, [message, status, navigate]);

  const onSubmit = async (values: SigninFormData): Promise<void> => {
    await login({ email: values.email, password: values.password });
  };

  const onErrorSubmit = (errors: FieldErrors<SigninFormData>): void => {
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
          title="Faça login na sua conta"
          subtitle="Bem-vindo de volta!"
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrorSubmit)}
            className="space-y-6"
          >
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <a
                      href="#"
                      className="text-sm font-semibold hover:text-primary/90 text-primary"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
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
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-2.5"
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

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-400">
            Não é membro?{' '}
            <a
              href="/signup"
              className="font-semibold leading-6 hover:text-primary/90 text-primary"
            >
              Cadastrar
            </a>
          </p>
        </Form>
      </div>
    </div>
  );
}

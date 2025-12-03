import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Cloud } from 'lucide-react';
import { useAuth } from '@/hooks/auth';

import { toast, Toaster } from 'sonner';
import { loginSchema, type LoginFormData } from '@/lib/auth-schema';
import type z from 'zod';

interface UseAuthProps {
  login: (data: LoginFormData) => Promise<void>;
  message: string;
  status: number;
}

export default function LoginPage() {
  const { login, message, status } = useAuth() as UseAuthProps;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (status >= 201 && status < 300) {
      toast.success('Login bem-sucedido!');
    } else if (message) {
      toast.error(message);
    }
  }, [message, status]);

  const onSubmit = async (values: LoginFormData) => {
    await login({ email: values.email, password: values.password });
  };

  const onErrorSubmit = (errors: z.infer<typeof loginSchema>) => {
    for (const field in errors) {
      const errorMessage = errors[field as keyof typeof errors]?.message;
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#101622]">
      <Toaster />
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Icon */}
          <div className="flex justify-center">
            <Cloud className="h-16 w-16 text-[#135bec]" strokeWidth={1.5} />
          </div>

          {/* Header */}
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight  text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Welcome back!
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrorSubmit)}
            className="space-y-6"
          >
            {/* Email Input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ou nome de usuário</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className="block w-full rounded-md border-0 bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#135bec] ring-slate-700 sm:text-sm sm:leading-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Input */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <a
                      href="#"
                      className="text-sm font-semibold hover:text-[#135bec]/90 text-blue-400"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Sua senha"
                      className="block w-full rounded-md border-0 bg-white/5 px-3 py-2.5shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#135bec] text-white ring-slate-700 sm:text-sm sm:leading-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex w-full justify-center rounded-lg bg-[#135bec] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#135bec]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135bec]"
            >
              {form.formState.isSubmitting ? 'Entrando...' : 'Login'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-10 text-center text-sm text-slate-400">
            Not a member?{' '}
            <a
              href="#"
              className="font-semibold leading-6 hover:text-[#135bec]/90 text-blue-400"
            >
              Sign Up
            </a>
          </p>
        </Form>
      </div>
    </div>
  );
}

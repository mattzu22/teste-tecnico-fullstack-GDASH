import { z } from 'zod';

export const SigninSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

export const SignupSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string().min(6, { message: 'As senhas não conferem.' }),
});

const UpdateSchemaBase = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email({ message: 'E-mail inválido.' })
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
    .optional()
    .or(z.literal('')),
  newPassword: z
    .string()
    .min(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.'})
    .optional()
    .or(z.literal('')),
});


export const UpdateSchema = UpdateSchemaBase.superRefine((data, ctx) => {
  if (data.newPassword && !data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Senha atual necessária para alterar a senha.',
      path: ['password'],
    });
  }
});

export type SigninFormData = z.infer<typeof SigninSchema>;
export type SignupFormData = z.infer<typeof SignupSchema>;
export type UpdateFormData = z.infer<typeof UpdateSchemaBase>;

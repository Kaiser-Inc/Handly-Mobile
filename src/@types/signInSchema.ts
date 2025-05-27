import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email('Email invalido'),
  password: z
    .string({ required_error: 'Campo obrigatório' })
    .min(8, 'A senha deve conter pelo menos 8 caracteres')
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: 'A senha deve conter pelo menos uma letra',
    })
    .refine((val) => !/^\d+$/.test(val), {
      message: 'A senha não pode conter apenas números',
    }),
})

export type SignInData = z.infer<typeof signInSchema>
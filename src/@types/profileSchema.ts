import { z } from 'zod'

export const nameProfileSchema = z
  .string({ required_error: 'Campo obrigatório' })
  .min(2, 'O nome deve ter no mínimo 2 caracteres')
  .max(60, 'O nome deve ter no máximo 60 caracteres')
  .refine((val) => !/[!@#$%/?;]/.test(val), {
    message: 'O nome não deve conter caracteres especiais',
  })
  .refine((val) => !/\d/.test(val), {
    message: 'O nome não deve conter números',
  })

export const imageProfileSchema = z.string().startsWith('data:image/', {
  message: 'A imagem deve estar em base64 e iniciar com "data:image/".',
})

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

export const phoneProfileSchema = z
  .string()
  .min(10, 'O telefone deve ter no mínimo 10 dígitos')
  .max(11, 'O telefone deve ter no máximo 11 dígitos')
  .refine((val) => /^\d+$/.test(val), {
    message: 'O telefone deve conter apenas números',
  })
  .optional()
  .or(z.literal(''))

export const profileUpdateSchema = z.object({
  name: nameProfileSchema.optional(),
  phone: phoneProfileSchema.optional(),
})

export const imageProfileSchema = z.string().startsWith('data:image/', {
  message: 'A imagem deve estar em base64 e iniciar com "data:image/".',
})

export interface Rating {
  id: string
  stars: number
  comment: string
}

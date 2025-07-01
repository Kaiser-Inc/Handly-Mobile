import { z } from 'zod'

export const nomeProfileSchema = z
  .string({ required_error: 'Campo obrigatório' })
  .min(2, 'O nome deve ter no mínimo 2 caracteres')
  .max(60, 'O nome deve ter no máximo 60 caracteres')
  .refine((val) => !/[!@#$%/?;]/.test(val), {
    message: 'O nome não deve conter caracteres especiais',
  })
  .refine((val) => !/\d/.test(val), {
    message: 'O nome não deve conter números',
  })

export const imagemProfileSchema = z
  .string()
  .startsWith('data:image/')
  .or(z.null())
  .refine(
    (val) =>
      val === null ||
      (typeof val === 'string' && val.startsWith('data:image/')),
    {
      message:
        'A imagem deve ser uma string base64 iniciando com "data:image/" ou nula',
    },
  )

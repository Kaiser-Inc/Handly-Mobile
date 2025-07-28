import z from 'zod'

export const serviceSchema = z.object({
  categories: z
    .array(z.string())
    .min(1, 'Campo obrigatório')
    .max(5, 'Máximo de 5 categorias'),
  description: z
    .string({ required_error: 'Campo obrigatório' })
    .min(10, 'A descrição deve ter no mínimo 10 caracteres.')
    .max(300, 'A descrição deve ter no máximo 300 caracteres'),
  image: z.string().nullable().optional(),
  name: z
    .string({ required_error: 'Campo obrigatório' })
    .min(2, 'O título deve ter no mínimo 2 caracteres')
    .max(60, 'O título deve ter no máximo 60 caracteres')
    .regex(
      /^[A-Za-zÀ-ÿ\s]+$/,
      'O título não deve conter números ou caracteres especiais',
    ),
})

export type serviceData = z.infer<typeof serviceSchema>

export type ServiceRating = {
  id: string
  service_id: string
  user_id: string
  stars: number
  comment: string
  created_at: string
}

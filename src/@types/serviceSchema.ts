import z from 'zod'

export const serviceSchema = z.object({
    categories: z.array(z.string()),
    description: z.string(),
    image: z.string().nullable(),
    name: z.string()
})

export type serviceData =  z.infer<typeof serviceSchema>
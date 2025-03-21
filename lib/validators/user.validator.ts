import z from 'zod'

export const UserValidation = z.object({
    name: z.string(),
    email: z.string().min(1),
    password: z.string().min(1)
})

export type UserType = z.infer<typeof UserValidation>;
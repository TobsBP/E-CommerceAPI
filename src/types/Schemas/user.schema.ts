import { z } from 'zod'

export const UserSchema = z.object({
	id: z.string().optional(),
	email: z.string().email(),
	password: z.string().min(6).optional(),
	role: z.string().optional(),
})

export const UpdateUserSchema = UserSchema.partial()

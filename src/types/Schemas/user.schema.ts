import { z } from 'zod'

export const ShirtSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
	role: z.string().optional(),
})

import { z } from 'zod'

export const ShirtSchema = z.object({
	name: z.string(),
	brand: z.string(),
	size: z.string(),
	price: z.number(),
	stock: z.number(),
	color: z.string(),
	category: z.string(),
	material: z.string(),
	gender: z.string(),
})

export type Shirt = z.infer<typeof ShirtSchema>

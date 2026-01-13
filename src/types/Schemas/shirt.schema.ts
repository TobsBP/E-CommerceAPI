import { z } from 'zod'

export const ShirtSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	brand: z.string(),
	price: z.number(),
	image: z.string(),
	rating: z.number(),
	reviews: z.number(),
	colors: z.array(z.string()),
	sizes: z.array(z.string()),
	description: z.string(),
	features: z.array(z.string()),
	category: z.string(),
	stock: z.number(),
})

export type Shirt = z.infer<typeof ShirtSchema>
export const UpdateShirtSchema = ShirtSchema.omit({ name: true }).partial()

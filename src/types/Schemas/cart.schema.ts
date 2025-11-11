import { z } from 'zod'

export const AddToCartSchema = z.object({
	shirtId: z.string(),
	quantity: z.number().min(1),
})

export const CartItemSchema = z.object({
	shirtId: z.string(),
	quantity: z.number().min(1),
	price: z.number().min(0),
})

export const CartSchema = z.object({
	userId: z.string(),
	items: z.array(CartItemSchema),
	total: z.number().min(0),
})

export type Cart = z.infer<typeof CartSchema>
export type CartItem = z.infer<typeof CartItemSchema>
export type AddToCart = z.infer<typeof AddToCartSchema>

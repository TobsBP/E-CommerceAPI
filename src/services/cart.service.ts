import { getCartByUser, saveCart } from '@/repositories/cart.repository'
import { getShirtById } from '@/repositories/shirt.repository'
import {
	CartSchema,
	type CartItem,
	type AddToCart,
} from '@/types/Schemas/cart.schema'

export class CartService {
	async getUserCart(userId: string) {
		const cart = await getCartByUser(userId)
		if (!cart) return { userId, items: [] as CartItem[], total: 0 }
		return cart
	}

	async addItem(userId: string, newItem: AddToCart) {
		const cart = await this.getUserCart(userId)
		const existing = cart.items.find((i) => i.shirtId === newItem.shirtId)

		if (existing) {
			existing.quantity += newItem.quantity
		} else {
			const shirt = await getShirtById(newItem.shirtId)
			if (!shirt) throw new Error('Shirt not found')

			cart.items.push({
				...newItem,
				price: shirt.price,
			})
		}

		cart.total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0)

		const parsed = CartSchema.safeParse(cart)

		if (!parsed.success) throw new Error('Invalid cart data')

		await saveCart(parsed.data)
		return parsed.data
	}

	async removeItem(userId: string, item: AddToCart) {
		const cart = await this.getUserCart(userId)
		const existing = cart.items.find((i) => i.shirtId === item.shirtId)

		if (!existing) throw new Error('Item not in cart')

		existing.quantity -= item.quantity

		if (existing.quantity <= 0) {
			cart.items = cart.items.filter((i) => i.shirtId !== item.shirtId)
		}

		cart.total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0)

		const parsed = CartSchema.safeParse(cart)
		if (!parsed.success) throw new Error('Invalid cart data')

		await saveCart(parsed.data)
		return true
	}
}

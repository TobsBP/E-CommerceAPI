import { cartCollection } from '@/config/database'
import type { Cart } from '@/types/Schemas/cart.schema'

export const getCartByUser = async (userId: string) => {
	const db = await cartCollection()
	return db.findOne({ userId })
}

export const saveCart = async (cart: Cart) => {
	const db = await cartCollection()
	return db.updateOne({ userId: cart.userId }, { $set: cart }, { upsert: true })
}

import { ShirtSchema } from '@/types/Schemas/shirt.schema'
import type { ShirtParams } from '@/types/Interfaces/IShirtParams'
import {
	getShirts,
	createShirt,
	updateShirt,
} from '@/repositories/shirt.repository'

export class ShirtService {
	async findShirt(name: string) {
		const shirt = await getShirts(name)
		if (!shirt) return null

		const parsed = ShirtSchema.safeParse(shirt)
		if (!parsed.success) throw new Error('Invalid data in the database.')

		return parsed.data
	}

	async addShirt(shirtData: ShirtParams) {
		const parsed = ShirtSchema.safeParse(shirtData)
		if (!parsed.success) throw new Error('Invalid data sent.')

		await createShirt(parsed.data)
		return { message: 'Shirt added!!' }
	}

	async editShirt(shirtData: ShirtParams) {
		const parsed = ShirtSchema.safeParse(shirtData)
		if (!parsed.success) throw new Error('Invalid data sent.')

		await updateShirt(parsed.data)
		return { message: 'Shirt edited' }
	}
}

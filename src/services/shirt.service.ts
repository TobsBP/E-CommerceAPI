import { ShirtSchema } from '@/types/Schemas/shirt.schema'
import type { ShirtParams } from '@/types/Interfaces/IShirtParams'
import { getshirts, createShirt } from '@/repositories/shirt.repository'

export class ShirtService {
	async findShirt(name: string) {
		const shirt = await getshirts(name)
		if (!shirt) return null

		const parsed = ShirtSchema.safeParse(shirt)
		if (!parsed.success) throw new Error('Dados inválidos no banco')

		return parsed.data
	}

	async addShirt(shirtData: ShirtParams) {
	  const parsed = ShirtSchema.safeParse(shirtData)
		if (!parsed.success) throw new Error('Dados inválidos enviados')

		await createShirt(parsed.data)
		return { message: 'Shirt added!!' }
	}
}

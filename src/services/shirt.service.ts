import { z } from 'zod'
import { ShirtSchema } from '@/types/Schemas/shirt.schema'
import type { ShirtParams } from '@/types/Interfaces/IShirtParams'
import {
	getShirtByName,
	createShirt,
	updateShirt,
	getShirts,
    getShirtById,
} from '@/repositories/shirt.repository'

export class ShirtService {
	async findShirt(name: string) {
		const shirt = await getShirtByName(name)
		if (!shirt) return null

		const parsed = ShirtSchema.safeParse(shirt)
		if (!parsed.success) throw new Error('Invalid data in the database.')

		return parsed.data
	}
	
	async findShirtById(id: string) {
  	const shirt = await getShirtById(id)
  	if (!shirt) return null
  
  	const parsed = ShirtSchema.safeParse(shirt)
  	if (!parsed.success) throw new Error('Invalid data in the database.')
  
  	return parsed.data
	}

	async findShirts() {
		const shirts = await getShirts()
		if (!shirts) return null

		const parsed = z.array(ShirtSchema).safeParse(shirts)
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

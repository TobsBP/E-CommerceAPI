import { shirtCollection } from '@/config/database'
import type { Shirt } from '@/types/Schemas/shirt.schema'
import { ObjectId } from 'mongodb'

export const getShirtByName = async (name: string) => {
	const db_shirts = await shirtCollection()

	return await db_shirts.findOne({ name: name })
}

export const getShirts = async () => {
	const db_shirts = await shirtCollection()

	return await db_shirts.find().toArray()
}

export const getShirtById = async (shirtId: string) => {
	const db_shirts = await shirtCollection()

	return await db_shirts.findOne({ _id: new ObjectId(shirtId) })
}

export const createShirt = async (shirt: Shirt) => {
	const db_shirts = await shirtCollection()

	return await db_shirts.insertOne(shirt)
}

export const updateShirt = async (shirt: Shirt) => {
	const db_shirts = await shirtCollection()

	const { name, ...rest } = shirt

	return await db_shirts.updateOne({ name: name }, { $set: rest })
}

import { shirtCollection } from '@/config/database'
import type { Shirt } from '@/types/Schemas/shirt.schema'

export const getShirts = async (name: string) => {
	const db_shirts = await shirtCollection()

	return await db_shirts.findOne({ name: name })
}

export const createShirt = async (shirt: Shirt) => {
	const db_shirts = await shirtCollection()

	return await db_shirts.insertOne(shirt)
}

export const updateShirt = async (shirt: Shirt, name: string) => {
  const db_shirts = await shirtCollection()
  
  return await db_shirts.updateOne(    
    { name: name }, 
    { $set: { ...shirt, name: name} } 
  )
}
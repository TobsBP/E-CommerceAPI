import type { Collection } from 'mongodb'
import { MongoClient } from 'mongodb'
import type { UserParams } from '@/types/Interfaces/IUserParams'
import type { Shirt } from '@/types/Schemas/shirt.schema'

const MONGO_URL = process.env.MONGO_URL as string
const client = new MongoClient(MONGO_URL)

let db_users: Collection<UserParams> | null = null
let db_shirts: Collection<Shirt> | null = null

export async function userCollection(): Promise<Collection<UserParams>> {
	if (!db_users) {
		try {
			await client.connect()
			const db = client.db('Items')
			db_users = db.collection<UserParams>('users')
		} catch (error) {
			console.error('Erro in connection with MongoDB:', error)
			throw error
		}
	}
	return db_users
}

export async function shirtCollection(): Promise<Collection<Shirt>> {
	if (!db_shirts) {
		try {
			await client.connect()
			const db = client.db('Items')
			db_shirts = db.collection<Shirt>('t_shirts')
		} catch (error) {
			console.error('Erro in connection with MongoDB:', error)
			throw error
		}
	}
	return db_shirts
}

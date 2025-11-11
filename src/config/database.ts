import type { Collection } from 'mongodb'
import { MongoClient } from 'mongodb'

const MONGO_URL = process.env.MONGO_URL as string
const client = new MongoClient(MONGO_URL)

let db_shirts: Collection | null = null

export async function shirtCollection() {
	if (!db_shirts) {
		try {
			await client.connect()
			const db = client.db('Items')
			db_shirts = db.collection('t_shirts')
		} catch (error) {
			console.error('Erro in conecttion with MongoDB:', error)
			throw error
		}
	}
	return db_shirts
}

import { MongoClient } from 'mongodb'

const MONGO_URL = process.env.MONGO_URL as string

const client = new MongoClient(MONGO_URL)

export const db = client.db('Items')

export const shirts = db.collection('t_shirts')

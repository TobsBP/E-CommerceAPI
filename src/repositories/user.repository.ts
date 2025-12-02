import { userCollection } from '@/config/database'
import type { UserParams } from '@/types/Interfaces/IUserParams'
import { ObjectId } from 'mongodb'

export const getUserByEmail = async (email: string) => {
	const users = await userCollection()
	return await users.findOne({ email })
}

export const createUser = async (user: UserParams) => {
	const users = await userCollection()
	return await users.insertOne(user)
}

export const getUserById = async (userId: string) => {
	const users = await userCollection()
	return await users.findOne({ _id: new ObjectId(userId) })
}

export const getUsers = async () => {
	const users = await userCollection()
	return await users.find().toArray()
}

export const updateUser = async (id: string, data: Partial<UserParams>) => {
	const users = await userCollection()
	return await users.updateOne({ _id: new ObjectId(id) }, { $set: data })
}

export const deleteUser = async (id: string) => {
	const users = await userCollection()
	return await users.deleteOne({ _id: new ObjectId(id) })
}

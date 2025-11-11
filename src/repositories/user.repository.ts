import { userCollection } from '@/config/database'
import type { UserParams } from '@/types/Interfaces/IUserParams'

export const getUserByEmail = async (email: string) => {
	const users = await userCollection()
	return await users.findOne({ email })
}

export const createUser = async (user: UserParams) => {
	const users = await userCollection()
	return await users.insertOne(user)
}

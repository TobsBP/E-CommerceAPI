import bcrypt from 'bcryptjs'
import type { FastifyReply } from 'fastify'
import type { UserParams } from '@/types/Interfaces/IUserParams'
import { getUserByEmail, createUser } from '@/repositories/user.repository'

export class AuthService {
	async register(userData: UserParams) {
		const existing = await getUserByEmail(userData.email)
		if (existing) throw new Error('User already exists')

		const hashed = await bcrypt.hash(userData.password, 10)
		await createUser({ ...userData, password: hashed })
		return { message: 'User created' }
	}

	async login(userData: UserParams, reply: FastifyReply) {
		const user = await getUserByEmail(userData.email)
		if (!user) throw new Error('Invalid credentials')

		const isValid = await bcrypt.compare(userData.password, user.password)
		if (!isValid) throw new Error('Invalid credentials')

		const token = await reply.jwtSign({ userId: user._id, role: user.role })
		return { token }
	}
}

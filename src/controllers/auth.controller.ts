import type { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '@/services/auth.service'
import type { UserParams } from '@/types/Interfaces/IUserParams'

const authService = new AuthService()

export const registerController = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const result = await authService.register(request.body as UserParams)
		return reply.status(201).send(result)
	} catch (err) {
		return reply.status(400).send({ message: err })
	}
}

export const loginController = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const result = await authService.login(request.body as UserParams, reply)
		return reply.send(result)
	} catch (err) {
		return reply.status(401).send({ message: err })
	}
}

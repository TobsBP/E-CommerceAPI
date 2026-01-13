import type { FastifyRequest, FastifyReply } from 'fastify'
import { UserService } from '@/services/user.service'
import type { UserParams } from '@/types/Interfaces/IUserParams'
import type { IUserRequestParams } from '@/types/Interfaces/IUserRequestParams'

const userService = new UserService()

export async function getUsersController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const users = await userService.findUsers()
		return reply.status(200).send(users)
	} catch (error) {
		request.log.error(error)
		return reply.status(500).send({ message: 'Internal Server Error' })
	}
}

export async function getUserByIdController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { id } = request.params as IUserRequestParams
		const user = await userService.findUserById(id)
		if (!user) {
			return reply.status(404).send({ message: 'User not found' })
		}
		return reply.status(200).send(user)
	} catch (error) {
		request.log.error(error)
		return reply.status(500).send({ message: 'Internal Server Error' })
	}
}

export async function updateUserController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { id } = request.params as IUserRequestParams
		const result = await userService.editUser(
			id,
			request.body as Partial<UserParams>,
		)
		return reply.status(200).send(result)
	} catch (error) {
		request.log.error(error)
		return reply.status(500).send({ message: (error as Error).message })
	}
}

export async function deleteUserController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { id } = request.params as IUserRequestParams
		const result = await userService.removeUser(id)
		return reply.status(200).send(result)
	} catch (error) {
		request.log.error(error)
		return reply.status(500).send({ message: (error as Error).message })
	}
}

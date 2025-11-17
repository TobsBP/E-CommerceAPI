import { ShirtService } from '@/services/shirt.service'
import type { FastifyRequest, FastifyReply } from 'fastify'
import type { ShirtParams } from '@/types/Interfaces/IShirtParams'
import type { IShirtRequestParams } from '@/types/Interfaces/IShirtRequestParams'

const shirtService = new ShirtService()

export async function getShirtController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { name } = request.params as IShirtRequestParams

		const shirt = await shirtService.findShirt(name)

		if (!shirt) {
			return reply.status(404).send({ message: 'Shirt not found' })
		}
		return reply.status(200).send(shirt)
	} catch (error) {
		request.log.error(error)
		return reply
			.status(500)
			.send({ message: 'Internal error while searching for shirt.' })
	}
}

export async function getShirtByIdController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const { id } = request.params as IShirtRequestParams

		const shirt = await shirtService.findShirt(id)

		if (!shirt) {
			return reply.status(404).send({ message: 'Shirt not found' })
		}
		return reply.status(200).send(shirt)
	} catch (error) {
		request.log.error(error)
		return reply
			.status(500)
			.send({ message: 'Internal error while searching for shirt.' })
	}
}

export async function getAllShirtsController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const shirts = await shirtService.findShirts()

		if (!shirts) {
			return reply.status(404).send({ message: 'Shirts not found' })
		}
		return reply.status(200).send(shirts)
	} catch (error) {
		request.log.error(error)
		return reply
			.status(500)
			.send({ message: 'Internal error while searching for shirt.' })
	}
}

export async function createShirtController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const response = await shirtService.addShirt(request.body as ShirtParams)
		reply.status(201).send(response)
	} catch (error) {
		request.log.error(error)
		reply.status(500).send({ message: (error as Error).message })
	}
}

export async function updateShirtController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const response = await shirtService.editShirt(request.body as ShirtParams)
		reply.status(201).send(response)
	} catch (error) {
		request.log.error(error)
		reply.status(500).send({ message: (error as Error).message })
	}
}

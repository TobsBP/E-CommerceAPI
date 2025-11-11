import type { FastifyRequest, FastifyReply } from 'fastify'
import { CartService } from '@/services/cart.service'
import type { AddToCart } from '@/types/Schemas/cart.schema'
import type { UserParams } from '@/types/Interfaces/IUserParams'

const cartService = new CartService()

export const addItemController = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const { userId } = request.user as UserParams
	const newItem = request.body as AddToCart
	const result = await cartService.addItem(userId, newItem)
	return reply.status(200).send(result)
}

export const removeItemController = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const { userId } = request.user as UserParams
	const newItem = request.body as AddToCart
	const result = await cartService.removeItem(userId, newItem)

	return reply.status(200).send({ message: result })
}

export const getItemController = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const { userId } = request.user as UserParams
	const result = await cartService.getUserCart(userId)

	console.log(result)

	return reply.status(200).send(result)
}	
import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/auth'
import {
	addItemController,
	getItemController,
	removeItemController,
} from '@/controllers/cart.controller'
import { AddToCartSchema, CartSchema } from '@/types/Schemas/cart.schema'
import { z } from 'zod'

export async function cartRoute(server: FastifyInstance) {
	server.post(
		'/cart/add',
		{
			preHandler: authenticate,
			schema: {
				body: AddToCartSchema,
				response: {
					200: CartSchema,
					404: z.object({ message: z.unknown() }),
					500: z.object({ message: z.unknown() }),
				},
				tags: ['Cart'],
			},
		},
		addItemController,
	)

	server.post(
		'/cart/remove',
		{
			preHandler: authenticate,
			schema: {
				body: AddToCartSchema,
				response: {
					200: z.object({ message: z.boolean() }),
					404: z.object({ message: z.unknown() }),
					500: z.object({ message: z.unknown() }),
				},
				tags: ['Cart'],
			},
		},
		removeItemController,
	)

	server.get(
		'/cart',
		{
			preHandler: authenticate,
			schema: {
				response: {
					200: CartSchema,
					404: z.object({ message: z.unknown() }),
					500: z.object({ message: z.unknown() }),
				},
				tags: ['Cart'],
			},
		},
		getItemController,
	)
}

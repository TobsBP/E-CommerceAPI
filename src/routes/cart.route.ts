import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/auth'
import {
	addItemController,
	removeItemController,
} from '@/controllers/cart.controller'
import { AddToCartSchema } from '@/types/Schemas/cart.schema'
import { z } from 'zod'

export async function cartRoute(server: FastifyInstance) {
	server.post(
		'/cart/add',
		{
			preHandler: authenticate,
			schema: {
				body: AddToCartSchema,
				response: {
					200: z.object({ message: z.unknown() }),
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
					200: z.object({ message: z.unknown() }),
					404: z.object({ message: z.unknown() }),
					500: z.object({ message: z.unknown() }),
				},
				tags: ['Cart'],
			},
		},
		removeItemController,
	)
}

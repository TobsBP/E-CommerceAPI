import type { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/auth'
import {
	addItemController,
	getItemController,
	removeItemController,
} from '@/controllers/cart.controller'
import { AddToCartSchema, CartSchema } from '@/types/Schemas/cart.schema'
import { ErrorSchema } from '@/types/Schemas/error.schema'
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
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Cart'],
				security: [{ bearerAuth: [] }],
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
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Cart'],
				security: [{ bearerAuth: [] }],
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
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Cart'],
				security: [{ bearerAuth: [] }],
			},
		},
		getItemController,
	)
}

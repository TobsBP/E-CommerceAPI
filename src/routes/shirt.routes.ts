import {
	getShirtController,
	createShirtController,
} from '../controllers/shirt.controller'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ShirtSchema } from '@/types/Schemas/shirt.schema'

export async function shirtRoute(server: FastifyInstance) {
	server.get(
		'/shirt/:name',
		{
			schema: {
				response: {
					200: ShirtSchema,
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		getShirtController,
	)

	server.post(
		'/shirt',
		{
			schema: {
				body: ShirtSchema,
				response: {
					201: z.object({ message: z.string() }),
					400: z.object({ message: z.string() }),
					500: z.object({ message: z.string() }),
				},
			},
		},
		createShirtController,
	)
}

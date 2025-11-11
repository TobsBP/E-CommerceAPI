import {
	getShirtController,
	createShirtController,
  updateShirtController,
} from '../controllers/shirt.controller'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ShirtSchema, UpdateShirtSchema } from '@/types/Schemas/shirt.schema'
import { authenticate } from '@/middleware/auth'

export async function shirtRoute(server: FastifyInstance) {
	server.get(
		'/shirt/:name',
		{
			preHandler: authenticate,
			schema: {
				response: {
					200: ShirtSchema,
					404: z.object({ message: z.string() }),
					500: z.object({ message: z.string() }),
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
	
	server.put(
	  '/shirt/:name',
		{
			schema: {
				body: UpdateShirtSchema,
				response: {
					201: z.object({ message: z.string() }),
					400: z.object({ message: z.string() }),
					500: z.object({ message: z.string() }),
				},
			},
		},
		updateShirtController,
	)
}

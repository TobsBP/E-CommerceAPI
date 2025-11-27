import {
	createShirtController,
	updateShirtController,
	getAllShirtsController,
	getShirtByIdController,
} from '../controllers/shirt.controller'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ShirtSchema, UpdateShirtSchema } from '@/types/Schemas/shirt.schema'
import { authenticate } from '@/middleware/auth'
import { ErrorSchema } from '@/types/Schemas/error.schema'

export async function shirtRoute(server: FastifyInstance) {
	server.get(
		'/shirt/:id',
		{
			preHandler: authenticate,
			schema: {
				response: {
					200: ShirtSchema,
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Shirt'],
				security: [{ bearerAuth: [] }],
			},
		},
		getShirtByIdController,
	)

	server.get(
		'/shirts',
		{
			preHandler: authenticate,
			schema: {
				response: {
					200: z.array(ShirtSchema),
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Shirt'],
				security: [{ bearerAuth: [] }],
			},
		},
		getAllShirtsController,
	)

	server.post(
		'/shirt',
		{
			preHandler: authenticate,
			schema: {
				body: ShirtSchema,
				response: {
					201: z.object({ message: z.string() }),
					400: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Shirt'],
				security: [{ bearerAuth: [] }],
			},
		},
		createShirtController,
	)

	server.put(
		'/shirt/:id',
		{
			preHandler: authenticate,
			schema: {
				body: UpdateShirtSchema,
				response: {
					201: z.object({ message: z.string() }),
					400: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Shirt'],
				security: [{ bearerAuth: [] }],
			},
		},
		updateShirtController,
	)
}

import type { FastifyInstance } from 'fastify'
import {
	registerController,
	loginController,
} from '@/controllers/auth.controller'
import { z } from 'zod'
import { ErrorSchema } from '@/types/Schemas/error.schema'

export async function authRoute(server: FastifyInstance) {
	server.post(
		'/register',
		{
			schema: {
				body: z.object({
					name: z.string().min(2),
					email: z.email(),
					password: z.string().min(6),
					role: z.string().optional(),
				}),
				response: {
					201: z.object({ message: z.string() }),
					400: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Auth'],
			},
		},
		registerController,
	)

	server.post(
		'/login',
		{
			schema: {
				body: z.object({
					email: z.email(),
					password: z.string().min(6),
				}),
				response: {
					200: z.object({ token: z.string() }),
					401: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Auth'],
			},
		},
		loginController,
	)
}

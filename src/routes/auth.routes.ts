import type { FastifyInstance } from 'fastify'
import {
	registerController,
	loginController,
} from '@/controllers/auth.controller'
import { z } from 'zod'

export async function authRoute(server: FastifyInstance) {
	server.post(
		'/register',
		{
			schema: {
				body: z.object({
					email: z.email(),
					password: z.string().min(6),
					role: z.string().optional(),
				}),
				response: {
					201: z.object({ message: z.unknown() }),
					400: z.object({ message: z.unknown() }),
					500: z.object({ message: z.unknown() }),
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
					401: z.object({ message: z.string() }),
					500: z.object({ message: z.string() }),
				},
				tags: ['Auth'],
			},
		},
		loginController,
	)
}

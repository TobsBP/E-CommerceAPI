import {
	getUsersController,
	getUserByIdController,
	updateUserController,
	deleteUserController,
} from '../controllers/user.controller'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UserSchema, UpdateUserSchema } from '@/types/Schemas/user.schema'
import { authenticate } from '@/middleware/auth'
import { ErrorSchema } from '@/types/Schemas/error.schema'

export async function userRoute(server: FastifyInstance) {
	server.get(
		'/users',
		{
			preHandler: authenticate,
			schema: {
				response: {
					200: z.array(UserSchema),
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['User'],
				security: [{ bearerAuth: [] }],
			},
		},
		getUsersController,
	)

	server.get(
		'/user/:id',
		{
			preHandler: authenticate,
			schema: {
				params: z.object({
					id: z.string(),
				}),
				response: {
					200: UserSchema,
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['User'],
				security: [{ bearerAuth: [] }],
			},
		},
		getUserByIdController,
	)

	server.put(
		'/user/:id',
		{
			preHandler: authenticate,
			schema: {
				params: z.object({
					id: z.string(),
				}),
				body: UpdateUserSchema,
				response: {
					200: z.object({ message: z.string() }),
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['User'],
				security: [{ bearerAuth: [] }],
			},
		},
		updateUserController,
	)

	server.delete(
		'/user/:id',
		{
			preHandler: authenticate,
			schema: {
				params: z.object({
					id: z.string(),
				}),
				response: {
					200: z.object({ message: z.string() }),
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['User'],
				security: [{ bearerAuth: [] }],
			},
		},
		deleteUserController,
	)
}

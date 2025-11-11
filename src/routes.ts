import type { FastifyInstance } from 'fastify'
import { shirtRoute } from '@/routes/shirt.route'
import { authRoute } from '@/routes/auth.route'
import { cartRoute } from '@/routes/cart.route'

export const routes = async (app: FastifyInstance) => {
	app.register(shirtRoute)
	app.register(authRoute)
	app.register(cartRoute)
}

import { ShirtService } from '@/services/shirt.service'
import type { FastifyRequest, FastifyReply } from 'fastify'
import type { ShirtParams } from '@/types/Interfaces/IShirtParams'

const shirtService = new ShirtService()

export async function getShirtController(request: FastifyRequest<{ Params: ShirtParams }>, reply: FastifyReply,) {
  try {
    const { name } = request.params

    const shirt = await shirtService.findShirt(name)

    if (!shirt) {
      return reply.status(404).send({ message: 'Camisa não encontrada' })
    }

    return reply.status(200).send(shirt)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ message: 'Erro interno ao buscar camisa' })
  }
}

export async function createShirtController(request: FastifyRequest<{ Body: ShirtParams }>, reply: FastifyReply,) {
  try {
    const response = await shirtService.addShirt(request.body)
    reply.status(201).send(response)
  } catch (error) {
    request.log.error(error)
    reply.status(500).send({ message: (error as Error).message })
  }
}

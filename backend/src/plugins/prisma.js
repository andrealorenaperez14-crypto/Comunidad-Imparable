import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

async function prismaPlugin(fastify) {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
  })

  // Conexión lazy — Prisma se conecta en el primer query automáticamente
  prisma.$connect().catch(err => {
    fastify.log.warn({ err: err.message }, 'Base de datos no disponible al inicio — reintentando en primer query')
  })
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
}

export default fp(prismaPlugin)
export { prismaPlugin }

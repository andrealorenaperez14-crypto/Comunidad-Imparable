import { requireAuth } from '../middleware/auth.js'
import { generateCertificatePdf } from '../services/certificates.js'

export async function certificateRoutes(fastify) {
  fastify.get('/:studentId', { preHandler: requireAuth }, async (request, reply) => {
    const { clientId } = request.user
    const { studentId } = request.params

    if (request.user.role !== 'ADMIN' && request.user.id !== studentId) {
      return reply.status(403).send({ error: 'Acceso denegado.' })
    }

    const certs = await fastify.prisma.certificate.findMany({
      where: { userId: studentId },
      orderBy: { issueDate: 'desc' }
    })

    return reply.send(certs)
  })

  fastify.get('/:certId/verify', async (request, reply) => {
    const cert = await fastify.prisma.certificate.findFirst({
      where: {
        OR: [
          { id: request.params.certId },
          { serialNumber: request.params.certId }
        ]
      },
      include: { user: { include: { profile: true } } }
    })

    if (!cert) return reply.status(404).send({ error: 'Certificado no encontrado.' })

    return reply.send({
      valid: cert.status === 'ISSUED',
      serialNumber: cert.serialNumber,
      studentName: cert.user.profile
        ? `${cert.user.profile.firstName} ${cert.user.profile.lastName}`
        : cert.user.email,
      courseName: cert.courseName,
      issueDate: cert.issueDate,
      status: cert.status
    })
  })

  fastify.post('/:certId/download', { preHandler: requireAuth }, async (request, reply) => {
    const cert = await fastify.prisma.certificate.findUnique({
      where: { id: request.params.certId },
      include: { user: { include: { profile: true } } }
    })

    if (!cert) return reply.status(404).send({ error: 'Certificado no encontrado.' })

    if (request.user.role !== 'ADMIN' && cert.userId !== request.user.id) {
      return reply.status(403).send({ error: 'Acceso denegado.' })
    }

    const pdfBuffer = await generateCertificatePdf(cert)

    return reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="certificado-${cert.serialNumber}.pdf"`)
      .send(pdfBuffer)
  })
}

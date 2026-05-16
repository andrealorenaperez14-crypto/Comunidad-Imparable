import PDFDocument from 'pdfkit'
import { randomBytes } from 'crypto'

export function generateSerialNumber() {
  return `CERT-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`
}

export function generateCertificatePdf(cert) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 })
    const chunks = []

    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Fondo
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0F1629')

    // Borde dorado
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3).stroke('#F59E0B')

    // Título
    doc.fillColor('#F59E0B')
      .fontSize(36)
      .font('Helvetica-Bold')
      .text('CERTIFICADO DE COMPLETACIÓN', 0, 80, { align: 'center' })

    // Línea separadora
    doc.moveTo(100, 140).lineTo(doc.page.width - 100, 140)
      .lineWidth(1).stroke('#2563EB')

    // Texto principal
    doc.fillColor('#FFFFFF')
      .fontSize(18)
      .font('Helvetica')
      .text('Este certificado acredita que', 0, 165, { align: 'center' })

    const studentName = cert.user?.profile
      ? `${cert.user.profile.firstName} ${cert.user.profile.lastName}`
      : cert.user?.email || 'Estudiante'

    doc.fillColor('#F59E0B')
      .fontSize(28)
      .font('Helvetica-Bold')
      .text(studentName, 0, 200, { align: 'center' })

    doc.fillColor('#FFFFFF')
      .fontSize(18)
      .font('Helvetica')
      .text('ha completado exitosamente el curso', 0, 245, { align: 'center' })

    doc.fillColor('#10B981')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text(cert.courseName, 0, 280, { align: 'center' })

    // Fecha
    const issueDate = new Date(cert.issueDate).toLocaleDateString('es-AR', {
      year: 'numeric', month: 'long', day: 'numeric'
    })

    doc.fillColor('#FFFFFF')
      .fontSize(14)
      .font('Helvetica')
      .text(`Emitido el ${issueDate}`, 0, 340, { align: 'center' })

    // Número de serie
    doc.fillColor('#9CA3AF')
      .fontSize(10)
      .text(`Número de serie: ${cert.serialNumber}`, 0, doc.page.height - 80, { align: 'center' })

    doc.text('Verifique la autenticidad en escueladigital.com/verificar', 0, doc.page.height - 60, { align: 'center' })

    doc.end()
  })
}

export async function issueCertificate(prisma, userId, courseId, courseName) {
  const existing = await prisma.certificate.findFirst({
    where: { userId, courseId, status: 'ISSUED' }
  })

  if (existing) return existing

  const serialNumber = generateSerialNumber()

  return prisma.certificate.create({
    data: {
      serialNumber,
      userId,
      courseId,
      courseName,
      status: 'ISSUED'
    }
  })
}

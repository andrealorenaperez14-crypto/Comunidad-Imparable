// ============================================================
// GOOGLE APPS SCRIPT — Lista VIP Pre-lanzamiento
// ============================================================
// COLUMNAS DEL SHEET (fila 1 = encabezados):
// A: Fecha
// B: Nombre
// C: Email
// D: WhatsApp
// E: Monto Página (lo que mostró la web)
// F: Cotización MEP
// G: Monto Recibido (lo que llegó por email)
// H: Estado Pago
//
// INSTRUCCIONES DE INSTALACIÓN:
// 1. Pegá este código en Apps Script
// 2. Implementar → Nueva implementación → Aplicación web
//    - Ejecutar como: Yo
//    - Acceso: Cualquier persona
// 3. Para activar la automatización de emails:
//    - Menú izquierdo → Activadores (reloj)
//    - + Agregar activador
//    - Función: procesarComprobantes
//    - Origen del evento: Basado en el tiempo
//    - Tipo: Cada 15 minutos (o cada hora)
//    - Guardar
// ============================================================

// ── RECIBIR REGISTRO DEL FORMULARIO DE LA PÁGINA ──────────

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  const data = JSON.parse(e.postData.contents)

  // Si viene del webhook de MP, el pago ya está confirmado
  // Si viene del formulario, queda Pendiente
  const estado = data.estado || 'Pendiente'
  const montoRecibido = data.montoRecibido || ''

  sheet.appendRow([
    new Date().toLocaleString('es-AR'),  // A: Fecha y hora
    data.nombre        || '',            // B: Nombre
    data.email         || '',            // C: Email
    data.whatsapp      || '',            // D: WhatsApp
    data.montoPesos    || '',            // E: Monto Página (MEP del momento)
    data.cotizacionMep || '',            // F: Cotización MEP
    montoRecibido,                       // G: Monto Recibido (confirma MP)
    estado                               // H: Estado Pago
  ])

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

// ── AUTOMATIZACIÓN: LEER EMAILS Y CONFIRMAR PAGOS ─────────

function procesarComprobantes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  const threads = GmailApp.search('subject:"[VIP ELITE] Comprobante de pago" is:unread')

  threads.forEach(thread => {
    thread.getMessages().forEach(message => {
      if (!message.isUnread()) return

      const body    = message.getPlainBody()
      const asunto  = message.getSubject()

      // Extraer monto del cuerpo del email
      const montoMatch = body.match(/Monto abonado:\s*\$([0-9.,]+)\s*pesos/i)
      // Extraer email del cliente del cuerpo
      const emailMatch  = body.match(/Email:\s*([^\n\r]+)/i)

      if (!montoMatch || !emailMatch) {
        message.markRead()
        return
      }

      const montoRecibidoTexto = `$${montoMatch[1].trim()} pesos`
      const montoRecibidoNum   = normalizar(montoMatch[1])
      const emailCliente       = emailMatch[1].trim().toLowerCase()

      // Buscar fila en el Sheet que coincida con ese email y esté Pendiente
      const datos = sheet.getDataRange().getValues()
      for (let i = 1; i < datos.length; i++) {
        const filEmail  = String(datos[i][2]).trim().toLowerCase() // Col C
        const filMonto  = String(datos[i][4]).trim()               // Col E
        const filEstado = String(datos[i][7]).trim()               // Col H

        if (filEmail !== emailCliente) continue
        if (filEstado === 'CONFIRMADO')  continue

        const montoPaginaNum = normalizar(filMonto)

        // Cargar monto recibido en Col G
        sheet.getRange(i + 1, 7).setValue(montoRecibidoTexto)

        // Comparar y actualizar estado en Col H
        if (montoPaginaNum === montoRecibidoNum) {
          sheet.getRange(i + 1, 8).setValue('CONFIRMADO')
        } else {
          sheet.getRange(i + 1, 8).setValue(`DIFERENCIA — recibido: ${montoRecibidoTexto}`)
        }

        break
      }

      message.markRead()
    })
  })
}

// Quita $, puntos de miles, espacios y "pesos" para comparar números
function normalizar(texto) {
  return String(texto)
    .replace(/\$/g, '')
    .replace(/pesos/gi, '')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim()
}

// ============================================================
// GOOGLE APPS SCRIPT — Lista VIP Escuela de Asesores
// ============================================================
// COLUMNAS DEL SHEET (fila 1 = encabezados):
// A: Fecha y hora
// B: Nombre completo
// C: DNI
// D: Email
// E: WhatsApp
// F: Importe pagado
//
// INSTRUCCIONES:
// 1. Pegá este código en Apps Script (reemplazá el anterior)
// 2. Implementar → Administrar implementaciones → lápiz (editar)
//    → Nueva versión → Implementar
// 3. Si la URL cambió, actualizá APPS_SCRIPT_VIP_URL en Render
// ============================================================

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  const data  = JSON.parse(e.postData.contents)

  sheet.appendRow([
    new Date().toLocaleString('es-AR'),  // A: Fecha y hora
    data.nombre        || '',            // B: Nombre completo
    data.dni           || '',            // C: DNI
    data.email         || '',            // D: Email
    data.whatsapp      || '',            // E: WhatsApp
    data.importePagado || ''             // F: Importe pagado
  ])

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

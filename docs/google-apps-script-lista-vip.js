// ============================================================
// GOOGLE APPS SCRIPT — Lista VIP Pre-lanzamiento
// ============================================================
// INSTRUCCIONES:
// 1. Abrí el Google Sheet con el mail de la Escuela de Asesores
// 2. Extensiones → Apps Script
// 3. Borrá todo lo que hay y pegá este código completo
// 4. Implementar → Nueva implementación → Aplicación web
//    - Ejecutar como: Yo (mail de la escuela)
//    - Quién tiene acceso: Cualquier persona
// 5. Copiá la URL de la aplicación web y pasásela a Luis
// ============================================================

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  const data = JSON.parse(e.postData.contents)

  sheet.appendRow([
    new Date().toLocaleString('es-AR'),
    data.nombre || '',
    data.email || '',
    data.whatsapp || ''
  ])

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

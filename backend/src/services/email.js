import { Resend } from 'resend'
import nodemailer from 'nodemailer'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Gmail SMTP como alternativa a Resend (no requiere dominio propio)
const gmailTransport = (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
    })
  : null

function h(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

async function sendEmail({ to, subject, html, required = false }) {
  // Prioridad: Resend → Gmail SMTP → simulado/error
  if (resend) {
    const result = await resend.emails.send({ from: FROM, to, subject, html })
    if (result.error) {
      const msg = typeof result.error === 'object' ? JSON.stringify(result.error) : String(result.error)
      console.error('[EMAIL] Resend rechazó el envío:', msg)
      throw new Error(`Email rechazado por Resend: ${msg}`)
    }
    return result
  }

  if (gmailTransport) {
    await gmailTransport.sendMail({
      from: `"${process.env.GMAIL_FROM_NAME || 'Escuela de Asesores'}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    })
    return { id: 'gmail' }
  }

  if (required || process.env.NODE_ENV === 'production') {
    throw new Error('Sin proveedor de email configurado (RESEND_API_KEY o GMAIL_USER+GMAIL_APP_PASSWORD).')
  }
  console.log(`[EMAIL SIMULADO] Para: ${to} | Asunto: ${subject}`)
  return { id: 'simulated' }
}

// ─── Layout base ────────────────────────────────────────────────────────────
function layout(content) {
  return `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:520px;margin:0 auto;background:#0C0C0C;color:#F5F0E8;border-radius:12px;overflow:hidden">
      <div style="background:#0C0C0C;padding:28px 32px 0;border-bottom:1px solid rgba(196,151,42,0.2)">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#C4972A;text-transform:uppercase">Escuela de Asesores MPS</p>
        <p style="margin:0 0 20px;font-size:10px;letter-spacing:1px;color:#8A8A7A">Formamos Líderes, No Vendedores</p>
      </div>
      <div style="padding:32px">
        ${content}
        <div style="margin-top:36px;padding-top:20px;border-top:1px solid rgba(196,151,42,0.15)">
          <p style="margin:0 0 2px;font-size:13px;color:#8A8A7A">Con todo mi compromiso,</p>
          <p style="margin:0;font-size:18px;color:#C4972A;font-style:italic">Yami Mansilla</p>
          <p style="margin:4px 0 0;font-size:11px;color:#8A8A7A;letter-spacing:1px">VISIONARIA · EMPRESARIA · CAPACITADORA</p>
          <p style="margin:2px 0 0;font-size:10px;color:#8A8A7A">Escuela de Asesores MPS</p>
        </div>
      </div>
    </div>
  `
}

function btn(text, url) {
  return `<a href="${url}" style="display:inline-block;margin-top:20px;background:#C4972A;color:#0C0C0C;padding:14px 28px;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px">${text}</a>`
}

const APP_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

// ─── Emails ──────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail({ email, firstName, schoolName, trialDays = 5 }) {
  await sendEmail({
    to: email,
    subject: `${h(firstName)}, tu acceso a la Escuela de Asesores MPS está listo`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">¡Hola, ${h(firstName)}!</h2>
      <p style="margin:0 0 12px;line-height:1.6">Bienvenida/o a la <strong>Escuela de Asesores MPS</strong>. Tomaste una decisión que va a cambiar el rumbo de tu carrera — y yo estoy acá para acompañarte en cada paso.</p>
      <p style="margin:0 0 12px;line-height:1.6">Tenés <strong style="color:#C4972A">${trialDays} días de acceso gratuito</strong> para descubrir todo lo que preparé para vos:</p>
      <ul style="margin:0 0 16px;padding-left:20px;line-height:2">
        <li>IA Coach — tu guía de aprendizaje 24/7</li>
        <li>IA Mentalidad — para romper los bloqueos que te frenan</li>
        <li>IA Consultiva — tu asesora de ventas y cierre</li>
      </ul>
      <p style="margin:0;line-height:1.6">No sigas tendencias. <strong style="color:#C4972A">Creálas.</strong></p>
      ${btn('Ingresar a la plataforma', `${APP_URL}/dashboard`)}
    `)
  })
}

export async function sendLowPerformanceEmailStudent({ email, firstName, schoolName, agentName, score }) {
  await sendEmail({
    to: email,
    subject: `${h(firstName)}, tengo algo importante que decirte`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">${h(firstName)}, te escribo personalmente.</h2>
      <p style="margin:0 0 12px;line-height:1.6">Vi que tu actividad con <strong>${h(agentName)}</strong> bajó. Y lo digo directo porque me importa tu resultado, no hacerte sentir bien con palabras vacías.</p>
      <p style="margin:0 0 12px;line-height:1.6">Los líderes que formo no se rinden cuando se pone difícil — <strong style="color:#C4972A">se levantan, preguntan y avanzan.</strong></p>
      <p style="margin:0 0 16px;line-height:1.6">Hoy tenés 3 cosas concretas para hacer:</p>
      <ol style="margin:0 0 16px;padding-left:20px;line-height:2">
        <li>Ingresá a la plataforma y abrí una conversación con tu IA</li>
        <li>Preguntale exactamente qué te traba — sin filtros</li>
        <li>Aplicá una sola cosa de lo que te diga hoy</li>
      </ol>
      <p style="margin:0;line-height:1.6">Un paso. Solo uno. El momentum empieza ahí.</p>
      ${btn('Retomar ahora', `${APP_URL}/dashboard`)}
    `)
  })
}

export async function sendLowPerformanceEmailClient({ email, clientName, studentName, agentName, score }) {
  await sendEmail({
    to: email,
    subject: `Alumno/a que necesita atención: ${h(studentName)}`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">Alerta de actividad baja</h2>
      <p style="margin:0 0 12px;line-height:1.6"><strong>${h(studentName)}</strong> registra baja interacción con <strong>${h(agentName)}</strong>.</p>
      <div style="background:#141414;border:1px solid rgba(196,151,42,0.2);border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0 0 4px;font-size:11px;color:#8A8A7A;letter-spacing:1px;text-transform:uppercase">Puntuación actual</p>
        <p style="margin:0;font-size:28px;font-weight:700;color:#C4972A">${(score * 100).toFixed(0)}%</p>
        <p style="margin:4px 0 0;font-size:11px;color:#8A8A7A">Umbral mínimo: 60%</p>
      </div>
      <p style="margin:0;line-height:1.6">Recomiendo un contacto directo para entender qué está frenando su avance.</p>
    `)
  })
}

export async function sendHighPerformanceEmailStudent({ email, firstName, schoolName, agentName, score }) {
  await sendEmail({
    to: email,
    subject: `${h(firstName)}, esto es lo que significa ser líder`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">¡${h(firstName)}, esto es lo que buscaba ver!</h2>
      <p style="margin:0 0 12px;line-height:1.6">Tu nivel de compromiso con <strong>${h(agentName)}</strong> es exactamente lo que distingue a quienes transforman su carrera de quienes solo lo intentan.</p>
      <div style="background:#141414;border:1px solid rgba(196,151,42,0.2);border-radius:8px;padding:16px;margin:16px 0;text-align:center">
        <p style="margin:0 0 4px;font-size:11px;color:#8A8A7A;letter-spacing:1px;text-transform:uppercase">Tu puntuación</p>
        <p style="margin:0;font-size:36px;font-weight:700;color:#C4972A">${(score * 100).toFixed(0)}%</p>
      </div>
      <p style="margin:0 0 12px;line-height:1.6">Esto no es suerte. Es decisión. Es consistencia. Es mentalidad de líder.</p>
      <p style="margin:0;line-height:1.6"><strong style="color:#C4972A">Seguí así — el ranking te está viendo.</strong></p>
      ${btn('Ver mi posición en el ranking', `${APP_URL}/dashboard/ranking`)}
    `)
  })
}

export async function sendHighPerformanceEmailClient({ email, clientName, studentName, agentName, score }) {
  await sendEmail({
    to: email,
    subject: `Alumno/a destacado/a: ${h(studentName)}`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">Rendimiento sobresaliente</h2>
      <p style="margin:0 0 12px;line-height:1.6"><strong>${h(studentName)}</strong> está teniendo un desempeño excelente con <strong>${h(agentName)}</strong>.</p>
      <div style="background:#141414;border:1px solid rgba(196,151,42,0.2);border-radius:8px;padding:16px;margin:16px 0;text-align:center">
        <p style="margin:0 0 4px;font-size:11px;color:#8A8A7A;letter-spacing:1px;text-transform:uppercase">Puntuación</p>
        <p style="margin:0;font-size:36px;font-weight:700;color:#C4972A">${(score * 100).toFixed(0)}%</p>
      </div>
      <p style="margin:0;line-height:1.6">Un candidato ideal para destacar como caso de éxito dentro de la escuela.</p>
    `)
  })
}

export async function sendNoLoginWarningEmail({ email, firstName, schoolName, daysSinceLogin }) {
  await sendEmail({
    to: email,
    subject: `${h(firstName)}, hace ${daysSinceLogin} días que no aparecés`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">${h(firstName)}, te estoy buscando.</h2>
      <p style="margin:0 0 12px;line-height:1.6">Hace <strong>${daysSinceLogin} días</strong> que no entrás a la plataforma. Y sé que la vida se pone intensa — pero también sé que eso es exactamente cuando más necesitás este espacio.</p>
      <p style="margin:0 0 12px;line-height:1.6">Los que rompen todos los esquemas no son los que nunca fallan. Son los que <strong style="color:#C4972A">vuelven siempre.</strong></p>
      <p style="margin:0 0 16px;line-height:1.6">Hoy, 5 minutos. Solo eso. Abrí la IA y contale qué está pasando.</p>
      ${btn('Volver a la plataforma', `${APP_URL}/dashboard`)}
    `)
  })
}

export async function sendSuspensionCountdownEmail({ email, firstName, schoolName, daysRemaining }) {
  await sendEmail({
    to: email,
    subject: `${h(firstName)}, te quedan ${daysRemaining} día${daysRemaining === 1 ? '' : 's'} de acceso`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">${h(firstName)}, el tiempo corre.</h2>
      <p style="margin:0 0 12px;line-height:1.6">Tu acceso a la <strong>Escuela de Asesores MPS</strong> vence en <strong style="color:#C4972A">${daysRemaining} día${daysRemaining === 1 ? '' : 's'}</strong>.</p>
      <p style="margin:0 0 16px;line-height:1.6">Todo lo que construiste — tu historial, tu posición en el ranking, tus conversaciones con las IAs — se guarda durante 10 días más. Pero el acceso activo, no.</p>
      <p style="margin:0;line-height:1.6">Si estás comprometida/o con tu crecimiento, este es el momento de renovar.</p>
      ${btn('Renovar mi acceso', `${APP_URL}/dashboard`)}
    `)
  })
}

export async function sendSuspensionExecutedEmail({ email, firstName, schoolName }) {
  await sendEmail({
    to: email,
    subject: `Tu acceso a Escuela de Asesores MPS fue suspendido`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">${h(firstName)}, tu acceso está pausado.</h2>
      <p style="margin:0 0 12px;line-height:1.6">Tu suscripción a la <strong>Escuela de Asesores MPS</strong> venció y tu cuenta fue suspendida.</p>
      <p style="margin:0 0 16px;line-height:1.6">Tus datos y progreso se conservan durante <strong style="color:#C4972A">10 días más</strong>. Si querés reactivar, escribinos y lo resolvemos rápido.</p>
      <p style="margin:0;line-height:1.6">Espero verte de vuelta. Los líderes siempre encuentran la forma.</p>
    `)
  })
}

export async function sendPasswordResetEmail({ email, firstName, schoolName, otp }) {
  await sendEmail({
    required: true,
    to: email,
    subject: `Tu contraseña provisoria — Escuela de Asesores MPS`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">Hola ${h(firstName)},</h2>
      <p style="margin:0 0 16px;line-height:1.6">Recibimos una solicitud para restablecer tu contraseña. Acá está tu clave provisoria:</p>
      <div style="background:#141414;border:1px solid rgba(196,151,42,0.3);border-radius:8px;padding:24px;text-align:center;margin:0 0 20px">
        <p style="margin:0 0 8px;font-size:11px;color:#8A8A7A;letter-spacing:2px;text-transform:uppercase">Contraseña provisoria</p>
        <span style="font-size:28px;font-weight:700;letter-spacing:0.25em;color:#C4972A;font-family:monospace">${h(otp)}</span>
      </div>
      <p style="margin:0 0 12px;line-height:1.6">Usala para ingresar y cambiala desde tu perfil apenas puedas.</p>
      <p style="margin:0;font-size:12px;color:#8A8A7A;line-height:1.6">Si no solicitaste este cambio, ignorá este email. Tu contraseña anterior no fue modificada.</p>
      ${btn('Ir al login', `${APP_URL}/login`)}
    `)
  })
}

export async function sendWeeklyReportEmail({ email, firstName, schoolName, metrics }) {
  const rows = metrics.map(m => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid rgba(196,151,42,0.1);color:#F5F0E8">${h(m.agentName)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid rgba(196,151,42,0.1);text-align:center;color:#C4972A;font-weight:600">${m.sessions}</td>
      <td style="padding:10px 12px;border-bottom:1px solid rgba(196,151,42,0.1);text-align:center;color:#F5F0E8">${(m.completion * 100).toFixed(0)}%</td>
      <td style="padding:10px 12px;border-bottom:1px solid rgba(196,151,42,0.1);text-align:center;color:${m.status === 'EXCELENTE' ? '#4ADE80' : m.status === 'ALERTA' ? '#F87171' : '#C4972A'}">${m.status}</td>
    </tr>
  `).join('')

  await sendEmail({
    to: email,
    subject: `${h(firstName)}, tu reporte semanal en Escuela de Asesores MPS`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">${h(firstName)}, así fue tu semana.</h2>
      <p style="margin:0 0 20px;line-height:1.6">La constancia se mide semana a semana. Acá está tu resumen:</p>
      <table style="width:100%;border-collapse:collapse;background:#141414;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:rgba(196,151,42,0.1)">
            <th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:1px;color:#8A8A7A;text-transform:uppercase">Agente</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:1px;color:#8A8A7A;text-transform:uppercase">Sesiones</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:1px;color:#8A8A7A;text-transform:uppercase">Avance</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:1px;color:#8A8A7A;text-transform:uppercase">Estado</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:20px 0 0;line-height:1.6">Cada sesión que completás es un paso que te separa del promedio. <strong style="color:#C4972A">Seguí.</strong></p>
      ${btn('Ver mi progreso completo', `${APP_URL}/dashboard`)}
    `)
  })
}

export async function sendVIPWelcomeEmail({ email, firstName, tempPassword, loginUrl }) {
  await sendEmail({
    to: email,
    subject: `${h(firstName)}, tu acceso VITALICIO está activo — Escuela de Asesores MPS`,
    html: layout(`
      <h2 style="margin:0 0 16px;color:#C4972A;font-size:20px">¡${h(firstName)}, bienvenida/o al nivel que pocos alcanzan!</h2>
      <p style="margin:0 0 16px;line-height:1.6">Tu acceso <strong style="color:#C4972A">VITALICIO</strong> a la Escuela de Asesores MPS está confirmado. Tomaste la mejor decisión para tu carrera — y yo me comprometo a estar presente en cada etapa.</p>
      <div style="background:#141414;border:1px solid rgba(196,151,42,0.25);border-radius:8px;padding:20px;margin:0 0 20px">
        <p style="margin:0 0 12px;font-size:11px;color:#8A8A7A;letter-spacing:2px;text-transform:uppercase">Tus credenciales de acceso</p>
        <p style="margin:0 0 6px;color:#F5F0E8"><span style="color:#8A8A7A">Email:</span> ${h(email)}</p>
        <p style="margin:0;color:#F5F0E8"><span style="color:#8A8A7A">Contraseña temporal:</span> <code style="background:#0C0C0C;padding:3px 10px;border-radius:4px;color:#C4972A;font-size:15px;letter-spacing:0.1em">${h(tempPassword)}</code></p>
      </div>
      <p style="margin:0 0 16px;font-size:12px;color:#8A8A7A">Cambiá tu contraseña ni bien ingreses desde tu perfil.</p>
      ${btn('Ingresar a la plataforma', loginUrl)}
    `)
  })
}

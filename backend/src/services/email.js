import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

async function sendEmail({ to, subject, html }) {
  if (!resend) {
    console.log(`[EMAIL SIMULADO] Para: ${to} | Asunto: ${subject}`)
    console.warn('[EMAIL] RESEND_API_KEY no configurado — los emails no se envían en producción')
    return { id: 'simulated' }
  }

  try {
    const result = await resend.emails.send({ from: FROM, to, subject, html })
    if (result.error) {
      console.error('[EMAIL] Resend rechazó el envío:', JSON.stringify(result.error))
    }
    return result
  } catch (err) {
    console.error('[EMAIL] Error enviando email a', to, ':', err.message)
  }
}

export async function sendWelcomeEmail({ email, firstName, schoolName, trialDays = 5 }) {
  await sendEmail({
    to: email,
    subject: `¡Bienvenido/a a ${schoolName}! 🎓`,
    html: `
      <h1>¡Hola ${firstName}! 👋</h1>
      <p>Te damos la bienvenida a <strong>${schoolName}</strong>.</p>
      <p>Tu período de prueba gratuita de <strong>${trialDays} días</strong> ha comenzado.</p>
      <p>Durante este tiempo tendrás acceso completo a:</p>
      <ul>
        <li>🤖 Agente IA Consultivo (responde tus preguntas)</li>
        <li>🎯 Agente IA Mentor (te acompaña en tu aprendizaje)</li>
        <li>🏆 Ranking de estudiantes</li>
        <li>📜 Certificados de completación</li>
      </ul>
      <p>¡Mucho éxito en tu formación!</p>
      <hr>
      <small>Para darte de baja de estas comunicaciones, <a href="#">haz clic aquí</a>.</small>
    `
  })
}

export async function sendLowPerformanceEmailStudent({ email, firstName, schoolName, agentName, score }) {
  await sendEmail({
    to: email,
    subject: `💡 Oportunidad de mejora en ${schoolName}`,
    html: `
      <h1>Hola ${firstName},</h1>
      <p>Hemos notado que tu rendimiento con el agente <strong>${agentName}</strong> tiene oportunidad de mejora.</p>
      <p>Tu puntuación actual: <strong>${(score * 100).toFixed(0)}%</strong></p>
      <p>Te invitamos a:</p>
      <ul>
        <li>📚 Revisar el material disponible</li>
        <li>💬 Consultar dudas con tu agente IA</li>
        <li>📅 Establecer un hábito de práctica diaria</li>
      </ul>
      <p>¡Sabemos que puedes lograrlo! Cada sesión cuenta. 💪</p>
      <hr>
      <small><a href="#">Cancelar suscripción a notificaciones</a></small>
    `
  })
}

export async function sendLowPerformanceEmailClient({ email, clientName, studentName, agentName, score }) {
  await sendEmail({
    to: email,
    subject: `[Alerta] Bajo rendimiento: ${studentName}`,
    html: `
      <h1>Alerta de rendimiento</h1>
      <p>El estudiante <strong>${studentName}</strong> tiene bajo rendimiento en <strong>${agentName}</strong>.</p>
      <p>Puntuación: <strong>${(score * 100).toFixed(0)}%</strong> (umbral: 60%)</p>
      <p>Se recomienda intervención personalizada.</p>
    `
  })
}

export async function sendHighPerformanceEmailStudent({ email, firstName, schoolName, agentName, score }) {
  await sendEmail({
    to: email,
    subject: `🏆 ¡Felicitaciones! Excelente rendimiento en ${schoolName}`,
    html: `
      <h1>¡Felicitaciones ${firstName}! 🎉</h1>
      <p>Tu desempeño con <strong>${agentName}</strong> es sobresaliente.</p>
      <p>Puntuación: <strong>${(score * 100).toFixed(0)}%</strong> ¡Increíble!</p>
      <p>Sigue así, ¡estás en el camino correcto hacia el éxito! 🚀</p>
      <hr>
      <small><a href="#">Cancelar suscripción a notificaciones</a></small>
    `
  })
}

export async function sendHighPerformanceEmailClient({ email, clientName, studentName, agentName, score }) {
  await sendEmail({
    to: email,
    subject: `⭐ Estudiante destacado: ${studentName}`,
    html: `
      <h1>Estudiante destacado</h1>
      <p><strong>${studentName}</strong> tiene un desempeño excelente en <strong>${agentName}</strong>.</p>
      <p>Puntuación: <strong>${(score * 100).toFixed(0)}%</strong></p>
    `
  })
}

export async function sendNoLoginWarningEmail({ email, firstName, schoolName, daysSinceLogin }) {
  await sendEmail({
    to: email,
    subject: `⏰ ¡Te extrañamos en ${schoolName}!`,
    html: `
      <h1>Hola ${firstName}, ¿cómo estás? 👋</h1>
      <p>Hace <strong>${daysSinceLogin} días</strong> que no ingresas a ${schoolName}.</p>
      <p>Tu progreso te está esperando. Recuerda que la constancia es la clave del éxito.</p>
      <p>¡Solo 15 minutos al día pueden hacer una gran diferencia! ⚡</p>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background:#2563EB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Retomar mi aprendizaje</a></p>
      <hr>
      <small><a href="#">Cancelar suscripción a notificaciones</a></small>
    `
  })
}

export async function sendSuspensionCountdownEmail({ email, firstName, schoolName, daysRemaining }) {
  await sendEmail({
    to: email,
    subject: `⚠️ Tu acceso a ${schoolName} vence en ${daysRemaining} día(s)`,
    html: `
      <h1>Hola ${firstName},</h1>
      <p>Tu suscripción a <strong>${schoolName}</strong> vence en <strong>${daysRemaining} día(s)</strong>.</p>
      <p>Para no perder tu progreso, renueva tu plan antes de que se suspenda tu cuenta.</p>
      <p>Recuerda que tu historial se conserva por 10 días después de la suspensión.</p>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background:#F59E0B;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Renovar mi suscripción</a></p>
      <hr>
      <small><a href="#">Cancelar suscripción a notificaciones</a></small>
    `
  })
}

export async function sendSuspensionExecutedEmail({ email, firstName, schoolName }) {
  await sendEmail({
    to: email,
    subject: `Cuenta suspendida en ${schoolName}`,
    html: `
      <h1>Hola ${firstName},</h1>
      <p>Tu cuenta en <strong>${schoolName}</strong> ha sido suspendida por vencimiento de suscripción.</p>
      <p>Tu progreso y datos estarán guardados durante <strong>10 días más</strong>.</p>
      <p>Si deseas reactivar tu cuenta, comunícate con nosotros.</p>
      <hr>
      <small><a href="#">Cancelar suscripción a notificaciones</a></small>
    `
  })
}

export async function sendPasswordResetEmail({ email, firstName, schoolName, otp }) {
  await sendEmail({
    to: email,
    subject: `Tu contraseña provisoria — ${schoolName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#C4972A">Recuperación de contraseña</h2>
        <p>Hola ${firstName},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña en <strong>${schoolName}</strong>.</p>
        <p>Tu contraseña provisoria es:</p>
        <div style="background:#141414;border:1px solid rgba(196,151,42,0.3);border-radius:8px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:32px;font-weight:700;letter-spacing:0.2em;color:#C4972A;font-family:monospace">${otp}</span>
        </div>
        <p>Ingresá con esta contraseña y luego cambiala desde tu perfil.</p>
        <p style="color:#8A8A7A;font-size:0.9em">Si no solicitaste este cambio, ignorá este email. Tu contraseña anterior no fue modificada si no usás esta.</p>
        <hr style="border-color:rgba(196,151,42,0.15)">
        <small style="color:#8A8A7A">${schoolName}</small>
      </div>
    `
  })
}

export async function sendWeeklyReportEmail({ email, firstName, schoolName, metrics }) {
  const metricsHtml = metrics.map(m => `
    <tr>
      <td>${m.agentName}</td>
      <td>${m.sessions}</td>
      <td>${(m.completion * 100).toFixed(0)}%</td>
      <td>${m.status}</td>
    </tr>
  `).join('')

  await sendEmail({
    to: email,
    subject: `📊 Tu reporte semanal de ${schoolName}`,
    html: `
      <h1>Hola ${firstName}, aquí está tu reporte semanal 📈</h1>
      <table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">
        <thead>
          <tr><th>Agente</th><th>Sesiones</th><th>Completación</th><th>Estado</th></tr>
        </thead>
        <tbody>${metricsHtml}</tbody>
      </table>
      <p>¡Sigue así! La consistencia es la clave del éxito. 🚀</p>
      <hr>
      <small><a href="#">Cancelar suscripción a notificaciones</a></small>
    `
  })
}

export async function sendVIPWelcomeEmail({ email, firstName, tempPassword, loginUrl }) {
  await sendEmail({
    to: email,
    subject: '¡Tu acceso VIP ELITE está listo! — Escuela de Asesores',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0C0C0C;color:#F5F0E8;border-radius:12px">
        <h1 style="color:#C4972A;font-size:1.5rem;margin-bottom:8px">¡Bienvenido/a, ${firstName}!</h1>
        <p style="color:#F5F0E8;margin-bottom:24px">Tu pago fue confirmado. Ya tenés acceso al <strong style="color:#C4972A">sector VIP ELITE</strong> de la Escuela de Asesores.</p>
        <div style="background:#141414;border:1px solid rgba(196,151,42,0.25);border-radius:8px;padding:20px;margin-bottom:24px">
          <p style="margin:0 0 8px;color:#8A8A7A;font-size:0.85rem">TUS CREDENCIALES DE ACCESO</p>
          <p style="margin:0 0 4px"><strong>Email:</strong> ${email}</p>
          <p style="margin:0"><strong>Contraseña temporal:</strong> <code style="background:#0C0C0C;padding:2px 8px;border-radius:4px;color:#C4972A">${tempPassword}</code></p>
        </div>
        <a href="${loginUrl}" style="display:block;background:#C4972A;color:#0C0C0C;text-align:center;padding:14px;border-radius:8px;font-weight:700;text-decoration:none;margin-bottom:16px">
          Ingresar a la plataforma
        </a>
        <p style="color:#8A8A7A;font-size:0.8rem;text-align:center">Te recomendamos cambiar tu contraseña luego de ingresar.</p>
      </div>
    `
  })
}

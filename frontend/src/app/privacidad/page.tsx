'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">

        <Link
          href="/register"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Volver al registro
        </Link>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-gold)' }}>Escuela de Asesores MPS</p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Política de Privacidad</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Última actualización: junio de 2026 · Ciudad Autónoma de Buenos Aires, Argentina</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>1. Responsable del tratamiento de datos</h2>
            <p><strong>Yamila Mansilla</strong>, bajo la marca "Escuela de Asesores MPS", con domicilio en la Ciudad Autónoma de Buenos Aires, República Argentina, es la responsable del tratamiento de los datos personales recabados a través de esta plataforma digital, en cumplimiento de la <strong>Ley 25.326 de Protección de los Datos Personales</strong> y sus normas reglamentarias.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>2. Datos que recopilamos</h2>
            <p className="mb-3">Al registrarse y utilizar la plataforma, recopilamos los siguientes datos:</p>
            <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--color-gold)' }}>Datos de identificación</p>
                <p style={{ color: 'var(--color-text-muted)' }}>Nombre, apellido, dirección de correo electrónico y Documento Nacional de Identidad (DNI).</p>
              </div>
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--color-gold)' }}>Datos de uso</p>
                <p style={{ color: 'var(--color-text-muted)' }}>Historial de interacciones con los agentes IA, progreso en cursos, cantidad y frecuencia de sesiones, posición en el ranking y métricas de rendimiento.</p>
              </div>
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--color-gold)' }}>Datos de suscripción</p>
                <p style={{ color: 'var(--color-text-muted)' }}>Plan contratado, fecha de inicio, estado de la suscripción y registro de pagos (sin datos de tarjeta, procesados por terceros).</p>
              </div>
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--color-gold)' }}>Datos técnicos</p>
                <p style={{ color: 'var(--color-text-muted)' }}>Fecha y hora de acceso, tipo de dispositivo y dirección IP.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>3. Finalidad del tratamiento</h2>
            <p className="mb-2">Utilizamos los datos personales para:</p>
            <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--color-text-muted)' }}>
              <li>Gestionar el acceso y la cuenta del/la Usuario/a</li>
              <li>Prestar los servicios educativos y de IA contratados</li>
              <li>Generar métricas de rendimiento y reportes personalizados</li>
              <li>Enviar comunicaciones relacionadas con el servicio (alertas de rendimiento, vencimientos, certificados)</li>
              <li>Mejorar la calidad del servicio y los agentes IA</li>
              <li>Cumplir con obligaciones legales aplicables</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>4. Comunicaciones por correo electrónico</h2>
            <p className="mb-2">La plataforma envía comunicaciones automáticas al correo registrado, incluyendo:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3" style={{ color: 'var(--color-text-muted)' }}>
              <li>Email de bienvenida al registrarse</li>
              <li>Alertas de rendimiento (bajo o sobresaliente)</li>
              <li>Avisos de inactividad</li>
              <li>Notificaciones de vencimiento de suscripción</li>
              <li>Reportes semanales de actividad</li>
              <li>Certificados emitidos</li>
            </ul>
            <p>El/la Usuario/a puede solicitar la baja de estas comunicaciones no esenciales contactando a la plataforma. Las comunicaciones vinculadas directamente al servicio contratado (vencimientos, suspensión de cuenta, recuperación de contraseña) no pueden desactivarse.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>5. Conservación de datos</h2>
            <p className="mb-2">Los datos se conservan mientras la cuenta esté activa. Ante la suspensión o baja:</p>
            <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--color-text-muted)' }}>
              <li>Los datos permanecen disponibles durante 10 días hábiles adicionales para posible recuperación</li>
              <li>Transcurrido dicho plazo, los datos son eliminados del sistema activo</li>
              <li>Se mantiene un registro mínimo anonimizado (DNI hasheado, métricas agregadas) por un período de hasta 1 año, con fines estadísticos</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>6. Compartición de datos con terceros</h2>
            <p className="mb-2">Los datos personales no se venden ni ceden a terceros con fines comerciales. Se comparten únicamente con:</p>
            <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--color-text-muted)' }}>
              <li><strong>Proveedores de infraestructura</strong> (servicios de hosting y base de datos): únicamente los datos necesarios para el funcionamiento técnico</li>
              <li><strong>Procesadores de pago</strong> (Mercado Pago): para gestionar transacciones, bajo sus propias políticas de privacidad</li>
              <li><strong>Proveedores de IA</strong> (Anthropic, Google, OpenAI): los mensajes enviados a los agentes IA pueden procesarse en sus plataformas bajo sus respectivas políticas de privacidad</li>
              <li><strong>Servicios de envío de email</strong>: para el envío de comunicaciones transaccionales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>7. Seguridad de los datos</h2>
            <p>Implementamos medidas de seguridad técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida o alteración. Las contraseñas se almacenan encriptadas mediante algoritmos de hash seguros. Las comunicaciones se realizan bajo protocolo HTTPS.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>8. Derechos del usuario (Ley 25.326)</h2>
            <p className="mb-3">En virtud de la Ley 25.326, el/la Usuario/a tiene derecho a:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Acceso', desc: 'Solicitar información sobre sus datos almacenados' },
                { title: 'Rectificación', desc: 'Corregir datos inexactos o incompletos' },
                { title: 'Supresión', desc: 'Solicitar la eliminación de sus datos personales' },
                { title: 'Confidencialidad', desc: 'Sus datos no serán divulgados sin su consentimiento' },
              ].map(r => (
                <div key={r.title} className="p-3 rounded-lg" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-separator)' }}>
                  <p className="font-medium text-xs mb-1" style={{ color: 'var(--color-gold)' }}>{r.title}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4" style={{ color: 'var(--color-text-muted)' }}>
              La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, Órgano de Control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>9. Cookies y tecnologías de seguimiento</h2>
            <p>La plataforma utiliza cookies de sesión necesarias para el funcionamiento técnico del servicio (autenticación y preferencias de usuario). No se utilizan cookies de seguimiento publicitario ni se comparten datos con redes de publicidad.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>10. Menores de edad</h2>
            <p>El servicio está dirigido a mayores de 18 años. No se recopilan intencionalmente datos de menores. Si se detecta que un/a usuario/a es menor de edad, su cuenta será dada de baja y sus datos eliminados.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>11. Modificaciones a esta política</h2>
            <p>Esta política puede actualizarse. Las modificaciones serán notificadas por correo electrónico y publicadas en la plataforma con al menos 15 días de anticipación a su entrada en vigencia.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>12. Contacto</h2>
            <p>Para ejercer sus derechos o realizar consultas sobre el tratamiento de sus datos personales, el/la Usuario/a puede contactarse a través de los canales oficiales disponibles en la plataforma.</p>
          </section>

        </div>

        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--color-separator)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
            © 2026 Escuela de Asesores MPS · Yamila Mansilla · Ciudad Autónoma de Buenos Aires, Argentina<br />
            Ley 25.326 de Protección de Datos Personales · Agencia de Acceso a la Información Pública
          </p>
        </div>
      </div>
    </div>
  )
}

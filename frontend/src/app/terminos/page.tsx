'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TerminosPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Volver al inicio
        </Link>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-gold)' }}>Comunidad Imparables</p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Términos y Condiciones</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Última actualización: agosto de 2026 · Ciudad Autónoma de Buenos Aires, Argentina</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>1. Partes del contrato</h2>
            <p>El presente acuerdo se celebra entre <strong>Alejandra Cuello y Cintia Paolucci</strong> (en adelante "Comunidad Imparables" o "la Plataforma"), con domicilio en la Ciudad Autónoma de Buenos Aires, República Argentina, y toda persona física que se registre como usuario en la plataforma digital disponible en este sitio (en adelante "el/la Usuario/a").</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>2. Objeto del servicio</h2>
            <p>La Plataforma ofrece servicios de formación, mentoría y desarrollo personal mediante acceso a clases en vivo y grabadas, mentoría grupal semanal, comunidad privada de acompañamiento y materiales de formación complementarios orientados al crecimiento personal, la espiritualidad y la construcción de una vida y un negocio alineados con el propósito de cada persona.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>3. Registro y cuenta de usuario</h2>
            <p className="mb-2">Para acceder al servicio, el/la Usuario/a deberá crear una cuenta personal proporcionando información veraz, actualizada y completa, incluyendo nombre, apellido, dirección de correo electrónico y número de Documento Nacional de Identidad (DNI).</p>
            <p className="mb-2">El/la Usuario/a es responsable de mantener la confidencialidad de sus credenciales de acceso. Cualquier actividad realizada desde su cuenta es de su exclusiva responsabilidad.</p>
            <p>Cada DNI podrá estar asociado a una sola cuenta. En caso de reingreso, el sistema verificará si el DNI fue utilizado previamente.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>4. Planes y suscripciones</h2>
            <p className="mb-2"><strong>Período de prueba gratuita:</strong> Al registrarse, el/la Usuario/a obtiene acceso gratuito por 5 (cinco) días corridos. Este beneficio es por única vez y no puede transferirse.</p>
            <p className="mb-2"><strong>Plan 30 días:</strong> Permite el acceso completo a la plataforma por el período contratado. La suscripción no se renueva automáticamente.</p>
            <p><strong>Plan Vitalicio:</strong> Otorga acceso permanente e ilimitado a los contenidos y funcionalidades disponibles al momento de la contratación, sujeto a la continuidad operativa de la plataforma.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>5. Pagos y facturación</h2>
            <p className="mb-2">Los pagos se procesan a través de Mercado Pago u otros medios habilitados en la plataforma. Al realizar un pago, el/la Usuario/a acepta los términos de uso del procesador de pagos correspondiente.</p>
            <p>Los precios se expresan en pesos argentinos (ARS) o en la moneda indicada al momento de la compra. La Plataforma se reserva el derecho de modificar los precios con previo aviso de 15 días.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>6. Política de cancelación y reembolso</h2>
            <p className="mb-2">De conformidad con la <strong>Ley 24.240 de Defensa del Consumidor</strong> y sus modificatorias, el/la Usuario/a tiene derecho a arrepentirse de la compra dentro de los 10 (diez) días corridos desde la contratación, siempre que no haya hecho uso del servicio contratado.</p>
            <p>Para solicitar el reembolso, el/la Usuario/a deberá contactar a la Plataforma a través de los canales oficiales indicados en el sitio. Los reembolsos se procesarán en el mismo medio de pago utilizado.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>7. Propiedad intelectual</h2>
            <p>Todos los contenidos de la plataforma (textos, videos, materiales de curso, diseño y código) son propiedad exclusiva de Comunidad Imparables o se utilizan bajo licencia. Queda prohibida su reproducción, distribución o comercialización sin autorización expresa y por escrito.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>8. Conducta del usuario</h2>
            <p className="mb-2">El/la Usuario/a se compromete a no utilizar la plataforma para fines ilícitos, difamatorios, abusivos o contrarios a la normativa vigente. Está expresamente prohibido:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2" style={{ color: 'var(--color-text-muted)' }}>
              <li>Compartir credenciales de acceso con terceros</li>
              <li>Intentar vulnerar la seguridad del sistema</li>
              <li>Reproducir o distribuir contenidos protegidos</li>
              <li>Tratar con falta de respeto a otros miembros de la comunidad</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>9. Suspensión y baja de cuenta</h2>
            <p className="mb-2">La Plataforma podrá suspender o dar de baja una cuenta ante el incumplimiento de estos términos, sin necesidad de notificación previa en casos graves.</p>
            <p>Al vencer la suscripción, la cuenta pasa a estado suspendido. Los datos del usuario se conservan por 10 (diez) días adicionales, tras los cuales son eliminados permanentemente del sistema activo.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>10. Limitación de responsabilidad</h2>
            <p>La Plataforma no garantiza la disponibilidad ininterrumpida del servicio y no será responsable por daños derivados de interrupciones técnicas, pérdida de datos o resultados obtenidos a partir del uso de los contenidos.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>11. Modificaciones</h2>
            <p>La Plataforma se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia a los 15 días de su publicación. El uso continuado del servicio implica la aceptación de los nuevos términos.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>12. Ley aplicable y jurisdicción</h2>
            <p>El presente acuerdo se rige por las leyes de la <strong>República Argentina</strong>. Ante cualquier controversia, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la <strong>Ciudad Autónoma de Buenos Aires</strong>, con renuncia expresa a cualquier otro fuero que pudiera corresponder.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--color-gold)' }}>13. Contacto</h2>
            <p>Para consultas sobre estos términos, el/la Usuario/a puede comunicarse a través de los canales oficiales disponibles en la plataforma.</p>
          </section>

        </div>

        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--color-separator)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
            © 2026 Comunidad Imparables · Alejandra Cuello y Cintia Paolucci · Ciudad Autónoma de Buenos Aires, Argentina
          </p>
        </div>
      </div>
    </div>
  )
}

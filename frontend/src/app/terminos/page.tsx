'use client'
import Link from 'next/link'

const gold = '#C17D1A'
const goldDim = 'rgba(193,125,26,0.15)'
const goldMid = 'rgba(193,125,26,0.35)'
const bg = '#160D28'
const bgCard = '#1F1238'
const text = '#FAF8F5'
const textSoft = 'rgba(250,248,245,0.72)'
const textDim = 'rgba(250,248,245,0.45)'
const sep = 'rgba(193,125,26,0.2)'

export default function TerminosPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .ti-body { background:${bg}; color:${text}; font-family:'DM Sans',sans-serif; min-height:100vh; }
        .ti-nav { position:sticky; top:0; z-index:10; background:rgba(22,13,40,0.9); backdrop-filter:blur(12px); border-bottom:1px solid ${goldDim}; padding:1rem 2rem; display:flex; align-items:center; gap:1rem; }
        .ti-nav-brand { font-family:'Cormorant Garamond',serif; font-size:0.95rem; letter-spacing:0.22em; text-transform:uppercase; color:${gold}; text-decoration:none; display:flex; align-items:center; gap:0.6rem; }
        .ti-nav-inf { font-size:1.3rem; line-height:1; }
        .ti-nav-back { margin-left:auto; font-family:'Montserrat',sans-serif; font-size:0.65rem; letter-spacing:0.18em; text-transform:uppercase; color:${textDim}; text-decoration:none; transition:color 0.2s; }
        .ti-nav-back:hover { color:${gold}; }
        .ti-wrap { max-width:780px; margin:0 auto; padding:4rem 2rem 6rem; }
        .ti-eyebrow { font-family:'Montserrat',sans-serif; font-size:0.62rem; letter-spacing:0.3em; text-transform:uppercase; color:${gold}; margin-bottom:0.8rem; display:block; }
        .ti-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2rem,5vw,3rem); font-weight:300; color:${text}; margin-bottom:0.5rem; letter-spacing:0.04em; }
        .ti-date { font-size:0.8rem; color:${textDim}; margin-bottom:3rem; font-family:'Montserrat',sans-serif; letter-spacing:0.05em; }
        .ti-ornament { display:flex; align-items:center; gap:1rem; margin:3rem 0; color:${gold}; opacity:0.4; }
        .ti-ornament::before,.ti-ornament::after { content:''; height:1px; flex:1; background:${gold}; opacity:0.4; }
        .ti-section { margin-bottom:2.5rem; }
        .ti-h2 { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:400; color:${gold}; margin-bottom:0.8rem; letter-spacing:0.06em; padding-left:1rem; border-left:2px solid ${goldMid}; }
        .ti-p { font-size:0.93rem; color:${textSoft}; line-height:1.75; margin-bottom:0.7rem; }
        .ti-ul { list-style:none; margin:0.5rem 0 0.7rem 0; display:flex; flex-direction:column; gap:0.5rem; }
        .ti-ul li { font-size:0.9rem; color:${textSoft}; padding:0.5rem 0.8rem; background:${goldDim}; border-left:2px solid ${goldMid}; line-height:1.5; }
        .ti-card { padding:1.5rem; background:${bgCard}; border:1px solid ${sep}; border-radius:4px; margin-top:1rem; }
        .ti-footer { margin-top:4rem; padding-top:2rem; border-top:1px solid ${sep}; }
        .ti-footer p { font-size:0.72rem; color:${textDim}; line-height:1.6; }
        @media (max-width:600px) { .ti-wrap { padding:2.5rem 1.2rem 4rem; } .ti-nav { padding:0.9rem 1rem; } }
      `}</style>
      <div className="ti-body">
        <nav className="ti-nav">
          <Link href="/" className="ti-nav-brand">
            <span className="ti-nav-inf">∞</span>
            <span>Comunidad Imparables</span>
          </Link>
          <Link href="/" className="ti-nav-back">← Volver al inicio</Link>
        </nav>

        <div className="ti-wrap">
          <span className="ti-eyebrow">Comunidad Imparables</span>
          <h1 className="ti-title">Términos y Condiciones</h1>
          <p className="ti-date">Última actualización: agosto de 2026 · Ciudad Autónoma de Buenos Aires, Argentina</p>

          <div className="ti-ornament"><span>∞</span></div>

          <div className="ti-section">
            <h2 className="ti-h2">1. Partes del contrato</h2>
            <p className="ti-p">El presente acuerdo se celebra entre <strong>Alejandra Cuello y Cintia Paolucci</strong> (en adelante "Comunidad Imparables" o "la Plataforma"), con domicilio en la Ciudad Autónoma de Buenos Aires, República Argentina, y toda persona física que se registre como usuario en la plataforma digital disponible en este sitio (en adelante "el/la Usuario/a").</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">2. Objeto del servicio</h2>
            <p className="ti-p">La Plataforma ofrece servicios de formación, mentoría y desarrollo personal mediante acceso a clases en vivo y grabadas, mentoría grupal semanal, comunidad privada de acompañamiento y materiales de formación complementarios orientados al crecimiento personal, la espiritualidad y la construcción de una vida y un negocio alineados con el propósito de cada persona.</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">3. Registro y cuenta de usuario</h2>
            <p className="ti-p">Para acceder al servicio, el/la Usuario/a deberá crear una cuenta personal proporcionando información veraz, actualizada y completa, incluyendo nombre, apellido, dirección de correo electrónico y número de Documento Nacional de Identidad (DNI).</p>
            <p className="ti-p">El/la Usuario/a es responsable de mantener la confidencialidad de sus credenciales de acceso. Cualquier actividad realizada desde su cuenta es de su exclusiva responsabilidad.</p>
            <p className="ti-p">Cada DNI podrá estar asociado a una sola cuenta. En caso de reingreso, el sistema verificará si el DNI fue utilizado previamente.</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">4. Planes y suscripciones</h2>
            <div className="ti-card">
              <p className="ti-p"><strong style={{ color: gold }}>Período de prueba gratuita:</strong> Al registrarse, el/la Usuario/a obtiene acceso gratuito por 5 (cinco) días corridos. Este beneficio es por única vez y no puede transferirse.</p>
              <p className="ti-p"><strong style={{ color: gold }}>Plan 30 días:</strong> Permite el acceso completo a la plataforma por el período contratado. La suscripción no se renueva automáticamente.</p>
              <p className="ti-p" style={{ marginBottom: 0 }}><strong style={{ color: gold }}>Plan Vitalicio:</strong> Otorga acceso permanente e ilimitado a los contenidos y funcionalidades disponibles al momento de la contratación, sujeto a la continuidad operativa de la plataforma.</p>
            </div>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">5. Pagos y facturación</h2>
            <p className="ti-p">Los pagos se procesan a través de Mercado Pago u otros medios habilitados en la plataforma. Al realizar un pago, el/la Usuario/a acepta los términos de uso del procesador de pagos correspondiente.</p>
            <p className="ti-p">Los precios se expresan en pesos argentinos (ARS) o en la moneda indicada al momento de la compra. La Plataforma se reserva el derecho de modificar los precios con previo aviso de 15 días.</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">6. Política de cancelación y reembolso</h2>
            <p className="ti-p">De conformidad con la <strong>Ley 24.240 de Defensa del Consumidor</strong> y sus modificatorias, el/la Usuario/a tiene derecho a arrepentirse de la compra dentro de los 10 (diez) días corridos desde la contratación, siempre que no haya hecho uso del servicio contratado.</p>
            <p className="ti-p">Para solicitar el reembolso, el/la Usuario/a deberá contactar a la Plataforma a través de los canales oficiales indicados en el sitio. Los reembolsos se procesarán en el mismo medio de pago utilizado.</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">7. Propiedad intelectual</h2>
            <p className="ti-p">Todos los contenidos de la plataforma (textos, videos, materiales de curso, diseño y código) son propiedad exclusiva de Comunidad Imparables o se utilizan bajo licencia. Queda prohibida su reproducción, distribución o comercialización sin autorización expresa y por escrito.</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">8. Conducta del usuario</h2>
            <p className="ti-p">El/la Usuario/a se compromete a no utilizar la plataforma para fines ilícitos, difamatorios, abusivos o contrarios a la normativa vigente. Está expresamente prohibido:</p>
            <ul className="ti-ul">
              <li>Compartir credenciales de acceso con terceros</li>
              <li>Intentar vulnerar la seguridad del sistema</li>
              <li>Reproducir o distribuir contenidos protegidos</li>
              <li>Tratar con falta de respeto a otros miembros de la comunidad</li>
            </ul>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">9. Suspensión y baja de cuenta</h2>
            <p className="ti-p">La Plataforma podrá suspender o dar de baja una cuenta ante el incumplimiento de estos términos, sin necesidad de notificación previa en casos graves.</p>
            <p className="ti-p">Al vencer la suscripción, la cuenta pasa a estado suspendido. Los datos del usuario se conservan por 10 (diez) días adicionales, tras los cuales son eliminados permanentemente del sistema activo.</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">10. Limitación de responsabilidad</h2>
            <p className="ti-p">La Plataforma no garantiza la disponibilidad ininterrumpida del servicio y no será responsable por daños derivados de interrupciones técnicas, pérdida de datos o resultados obtenidos a partir del uso de los contenidos.</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">11. Modificaciones</h2>
            <p className="ti-p">La Plataforma se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia a los 15 días de su publicación. El uso continuado del servicio implica la aceptación de los nuevos términos.</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">12. Ley aplicable y jurisdicción</h2>
            <p className="ti-p">El presente acuerdo se rige por las leyes de la <strong>República Argentina</strong>. Ante cualquier controversia, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la <strong>Ciudad Autónoma de Buenos Aires</strong>, con renuncia expresa a cualquier otro fuero que pudiera corresponder.</p>
          </div>

          <div className="ti-section">
            <h2 className="ti-h2">13. Contacto</h2>
            <p className="ti-p">Para consultas sobre estos términos, el/la Usuario/a puede comunicarse a través de los canales oficiales disponibles en la plataforma.</p>
          </div>

          <div className="ti-ornament"><span>∞</span></div>

          <div className="ti-footer">
            <p>© 2026 Comunidad Imparables · Alejandra Cuello y Cintia Paolucci<br />Ciudad Autónoma de Buenos Aires, Argentina</p>
          </div>
        </div>
      </div>
    </>
  )
}

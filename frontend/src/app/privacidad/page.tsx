'use client'
import Link from 'next/link'

const gold = '#C9952C'
const goldDim = 'rgba(201,149,44,0.15)'
const goldMid = 'rgba(201,149,44,0.35)'
const bg = '#160D28'
const bgCard = '#1F1238'
const text = '#FAF8F5'
const textSoft = 'rgba(250,248,245,0.72)'
const textDim = 'rgba(250,248,245,0.45)'
const sep = 'rgba(201,149,44,0.2)'

export default function PrivacidadPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .pr-body { background:${bg}; color:${text}; font-family:'DM Sans',sans-serif; min-height:100vh; }
        .pr-nav { position:sticky; top:0; z-index:10; background:rgba(22,13,40,0.9); backdrop-filter:blur(12px); border-bottom:1px solid ${goldDim}; padding:1rem 2rem; display:flex; align-items:center; gap:1rem; }
        .pr-nav-brand { font-family:'Cormorant Garamond',serif; font-size:0.95rem; letter-spacing:0.22em; text-transform:uppercase; color:${gold}; text-decoration:none; display:flex; align-items:center; gap:0.6rem; }
        .pr-nav-inf { font-size:1.3rem; line-height:1; }
        .pr-nav-back { margin-left:auto; font-family:'Montserrat',sans-serif; font-size:0.65rem; letter-spacing:0.18em; text-transform:uppercase; color:${textDim}; text-decoration:none; transition:color 0.2s; }
        .pr-nav-back:hover { color:${gold}; }
        .pr-wrap { max-width:780px; margin:0 auto; padding:4rem 2rem 6rem; }
        .pr-eyebrow { font-family:'Montserrat',sans-serif; font-size:0.62rem; letter-spacing:0.3em; text-transform:uppercase; color:${gold}; margin-bottom:0.8rem; display:block; }
        .pr-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2rem,5vw,3rem); font-weight:300; color:${text}; margin-bottom:0.5rem; letter-spacing:0.04em; }
        .pr-date { font-size:0.8rem; color:${textDim}; margin-bottom:3rem; font-family:'Montserrat',sans-serif; letter-spacing:0.05em; }
        .pr-ornament { display:flex; align-items:center; gap:1rem; margin:3rem 0; color:${gold}; opacity:0.4; }
        .pr-ornament::before,.pr-ornament::after { content:''; height:1px; flex:1; background:${gold}; opacity:0.4; }
        .pr-section { margin-bottom:2.5rem; }
        .pr-h2 { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:400; color:${gold}; margin-bottom:0.8rem; letter-spacing:0.06em; padding-left:1rem; border-left:2px solid ${goldMid}; }
        .pr-p { font-size:0.93rem; color:${textSoft}; line-height:1.75; margin-bottom:0.7rem; }
        .pr-ul { list-style:none; margin:0.5rem 0 0.7rem 0; display:flex; flex-direction:column; gap:0.5rem; }
        .pr-ul li { font-size:0.9rem; color:${textSoft}; padding:0.5rem 0.8rem; background:${goldDim}; border-left:2px solid ${goldMid}; line-height:1.5; }
        .pr-card { padding:1.5rem; background:${bgCard}; border:1px solid ${sep}; border-radius:4px; margin-top:1rem; }
        .pr-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; margin-top:1rem; }
        .pr-grid-item { padding:1rem; background:${bgCard}; border:1px solid ${sep}; border-radius:4px; }
        .pr-grid-label { font-family:'Montserrat',sans-serif; font-size:0.62rem; letter-spacing:0.15em; text-transform:uppercase; color:${gold}; margin-bottom:0.4rem; }
        .pr-grid-desc { font-size:0.82rem; color:${textDim}; line-height:1.5; }
        .pr-footer { margin-top:4rem; padding-top:2rem; border-top:1px solid ${sep}; }
        .pr-footer p { font-size:0.72rem; color:${textDim}; line-height:1.6; }
        @media (max-width:600px) { .pr-wrap { padding:2.5rem 1.2rem 4rem; } .pr-nav { padding:0.9rem 1rem; } .pr-grid { grid-template-columns:1fr; } }
      `}</style>
      <div className="pr-body">
        <nav className="pr-nav">
          <Link href="/" className="pr-nav-brand">
            <span className="pr-nav-inf">∞</span>
            <span>Comunidad Imparables</span>
          </Link>
          <Link href="/" className="pr-nav-back">← Volver al inicio</Link>
        </nav>

        <div className="pr-wrap">
          <span className="pr-eyebrow">Comunidad Imparables</span>
          <h1 className="pr-title">Política de Privacidad</h1>
          <p className="pr-date">Última actualización: agosto de 2026 · Ciudad Autónoma de Buenos Aires, Argentina</p>

          <div className="pr-ornament"><span>∞</span></div>

          <div className="pr-section">
            <h2 className="pr-h2">1. Responsable del tratamiento de datos</h2>
            <p className="pr-p"><strong>Alejandra Cuello y Cintia Paolucci</strong>, bajo la marca "Comunidad Imparables", con domicilio en la Ciudad Autónoma de Buenos Aires, República Argentina, son responsables del tratamiento de los datos personales recabados a través de esta plataforma digital, en cumplimiento de la <strong>Ley 25.326 de Protección de los Datos Personales</strong> y sus normas reglamentarias.</p>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">2. Datos que recopilamos</h2>
            <p className="pr-p">Al registrarse y utilizar la plataforma, recopilamos los siguientes datos:</p>
            <div className="pr-card">
              <p className="pr-p"><strong style={{ color: gold }}>Datos de identificación:</strong> Nombre, apellido, dirección de correo electrónico y Documento Nacional de Identidad (DNI).</p>
              <p className="pr-p"><strong style={{ color: gold }}>Datos de uso:</strong> Historial de acceso a contenidos, progreso en clases y frecuencia de participación en la comunidad.</p>
              <p className="pr-p"><strong style={{ color: gold }}>Datos de suscripción:</strong> Plan contratado, fecha de inicio, estado de la suscripción y registro de pagos (sin datos de tarjeta, procesados por terceros).</p>
              <p className="pr-p" style={{ marginBottom: 0 }}><strong style={{ color: gold }}>Datos técnicos:</strong> Fecha y hora de acceso, tipo de dispositivo y dirección IP.</p>
            </div>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">3. Finalidad del tratamiento</h2>
            <p className="pr-p">Utilizamos los datos personales para:</p>
            <ul className="pr-ul">
              <li>Gestionar el acceso y la cuenta del/la Usuario/a</li>
              <li>Prestar los servicios de formación y mentoría contratados</li>
              <li>Enviar comunicaciones relacionadas con el servicio (avisos de vencimiento, acceso a clases)</li>
              <li>Mejorar la calidad del servicio y la experiencia de la comunidad</li>
              <li>Cumplir con obligaciones legales aplicables</li>
            </ul>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">4. Comunicaciones por correo electrónico</h2>
            <p className="pr-p">La plataforma envía comunicaciones automáticas al correo registrado, incluyendo:</p>
            <ul className="pr-ul">
              <li>Email de bienvenida al registrarse</li>
              <li>Avisos de inactividad</li>
              <li>Notificaciones de vencimiento de suscripción</li>
              <li>Información sobre nuevos contenidos y clases</li>
            </ul>
            <p className="pr-p">El/la Usuario/a puede solicitar la baja de comunicaciones no esenciales contactando a la plataforma. Las comunicaciones vinculadas directamente al servicio (vencimientos, recuperación de contraseña) no pueden desactivarse.</p>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">5. Conservación de datos</h2>
            <p className="pr-p">Los datos se conservan mientras la cuenta esté activa. Ante la suspensión o baja:</p>
            <ul className="pr-ul">
              <li>Los datos permanecen disponibles durante 10 días hábiles adicionales para posible recuperación</li>
              <li>Transcurrido dicho plazo, los datos son eliminados del sistema activo</li>
            </ul>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">6. Compartición de datos con terceros</h2>
            <p className="pr-p">Los datos personales no se venden ni ceden a terceros con fines comerciales. Se comparten únicamente con:</p>
            <ul className="pr-ul">
              <li><strong>Proveedores de infraestructura</strong> (hosting y base de datos): únicamente los datos necesarios para el funcionamiento técnico</li>
              <li><strong>Procesadores de pago</strong> (Mercado Pago): para gestionar transacciones, bajo sus propias políticas de privacidad</li>
              <li><strong>Servicios de envío de email</strong>: para el envío de comunicaciones transaccionales</li>
            </ul>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">7. Seguridad de los datos</h2>
            <p className="pr-p">Implementamos medidas de seguridad técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida o alteración. Las contraseñas se almacenan encriptadas mediante algoritmos de hash seguros. Las comunicaciones se realizan bajo protocolo HTTPS.</p>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">8. Derechos del usuario (Ley 25.326)</h2>
            <p className="pr-p">En virtud de la Ley 25.326, el/la Usuario/a tiene derecho a:</p>
            <div className="pr-grid">
              {[
                { title: 'Acceso', desc: 'Solicitar información sobre sus datos almacenados' },
                { title: 'Rectificación', desc: 'Corregir datos inexactos o incompletos' },
                { title: 'Supresión', desc: 'Solicitar la eliminación de sus datos personales' },
                { title: 'Confidencialidad', desc: 'Sus datos no serán divulgados sin su consentimiento' },
              ].map(r => (
                <div key={r.title} className="pr-grid-item">
                  <p className="pr-grid-label">{r.title}</p>
                  <p className="pr-grid-desc">{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="pr-p" style={{ marginTop: '1rem' }}>La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, Órgano de Control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.</p>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">9. Cookies y tecnologías de seguimiento</h2>
            <p className="pr-p">La plataforma utiliza cookies de sesión necesarias para el funcionamiento técnico del servicio (autenticación y preferencias de usuario). No se utilizan cookies de seguimiento publicitario ni se comparten datos con redes de publicidad.</p>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">10. Menores de edad</h2>
            <p className="pr-p">El servicio está dirigido a mayores de 18 años. No se recopilan intencionalmente datos de menores. Si se detecta que un/a usuario/a es menor de edad, su cuenta será dada de baja y sus datos eliminados.</p>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">11. Modificaciones a esta política</h2>
            <p className="pr-p">Esta política puede actualizarse. Las modificaciones serán notificadas por correo electrónico y publicadas en la plataforma con al menos 15 días de anticipación a su entrada en vigencia.</p>
          </div>

          <div className="pr-section">
            <h2 className="pr-h2">12. Contacto</h2>
            <p className="pr-p">Para ejercer sus derechos o realizar consultas sobre el tratamiento de sus datos personales, el/la Usuario/a puede contactarse a través de los canales oficiales disponibles en la plataforma.</p>
          </div>

          <div className="pr-ornament"><span>∞</span></div>

          <div className="pr-footer">
            <p>© 2026 Comunidad Imparables · Alejandra Cuello y Cintia Paolucci<br />Ciudad Autónoma de Buenos Aires, Argentina · Ley 25.326 de Protección de Datos Personales</p>
          </div>
        </div>
      </div>
    </>
  )
}

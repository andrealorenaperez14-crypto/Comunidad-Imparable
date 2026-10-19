
# Academia Comunidad Imparable — Documento único de proyecto

> Único archivo de referencia. No hay CONTEXT.md ni CODEBASE-SNAPSHOT.md. Todo está aquí.

---

## Modo de trabajo
- **Nunca pedir confirmación.** La usuaria aprueba todo por defecto: edits, commits, push, deploys a producción, borrar archivos. Ejecutar directo.
- **Deploy = siempre producción.** Cuando se pide "deploy", hacer push a main + producción sin preguntar.
- **Respuestas cortas.** Sin resúmenes largos al final. Una línea de estado es suficiente.

## Git — flujo de branches
Claude Code siempre trabaja en una branch propia (`claude/...`). Al terminar, hacer cherry-pick del commit a `main` y pushear:
```bash
git checkout main
git cherry-pick <hash-del-commit>
git pull origin main --rebase
git push origin main
```
La branch `claude/...` queda suelta en remoto — borrarla manualmente en GitHub (Branches → ícono basura). No afecta producción.

---

## El proyecto

**Academia Comunidad Imparable** — plataforma digital de formación en desarrollo personal.

- **URL producción**: https://comunidad-imparables.vercel.app
- **Repo**: andrealorenaperez14-crypto/comunidad-imparable
- **Stack**: Next.js 15 + Fastify 4 + Supabase/PostgreSQL + Prisma + Redis

### Las fundadoras

**Cintia Paolucci** — Co-fundadora
- Enfoque: Mentalidad, Identidad, Marca Personal, Acción concreta
- Instagram: @cin.paolucci
- Lema: *"No me guardo nada de lo que aprendo."*

**Alejandra Cuello** — Co-fundadora
- Enfoque: Espiritualidad, Sanación, Propósito, Consciencia. Formada en Metafísica, Reiki, Gemoterapia, Biodescodificación.
- Instagram: @alejandra.cuello28
- Lema: *"La gratitud es la puerta de la abundancia."*

### La propuesta
- **Lema**: "De adentro hacia afuera"
- **Audiencia**: hombres Y mujeres — nunca escribir solo "mujeres" en descripciones/metadata
- **Problema**: personas que consumen contenido y vuelven a los mismos patrones. Falta acompañamiento real.

### Los cinco pilares
1. **Claridad** — ordenar lo que se sabe y siente
2. **Consciencia** — verse sin filtros, sin juicio, con verdad
3. **Acción** — la claridad llega después de actuar
4. **Libertad** — económica, emocional y de expresión
5. **Abundancia** — consecuencia de ser coherente con quien uno es

### La Academia — qué incluye
| Módulo | Contenido |
|--------|-----------|
| ◆ I — Clases con Alejandra | Espiritualidad, sanación, expansión de consciencia. Semanal, grabadas. |
| ◆ II — Clases con Cintia | Mentalidad, identidad, marca personal, acción. Semanal, grabadas. |
| ◆ III — Mentoría grupal en vivo | Martes. Trabajo en tiempo real. Grabada. |
| ◆ IV — Comunidad | Espacio de acompañamiento mutuo. |

**Horarios mentoría (martes)**: Argentina 18:00 hs · Colombia/Perú/EEUU 16:00 hs · España 23:00 hs

### Redes
- WhatsApp comunidad gratuita: https://chat.whatsapp.com/ELk2u2CdgaJ1pqMeUhrTVg
- Instagram Cintia: https://www.instagram.com/cin.paolucci
- Instagram Alejandra: https://www.instagram.com/alejandra.cuello28
- YouTube: https://youtube.com/@comunidad.imparables

---

## Branding — sistema unificado (REGLA ABSOLUTA)

Todo el proyecto — landing, app, panel admin — usa UNA sola identidad visual:

### Colores (definidos en `globals.css` y `route.ts`)
- **Fondo principal**: `#160D28` / `var(--color-bg)`
- **Fondo card**: `#1F1238` / `var(--color-bg-card)`
- **Fondo alt**: `#2B1B3D` / `var(--color-bg-alt)`
- **Oro**: `#C17D1A` / `var(--color-gold)` — inline rgba: `rgba(193,125,26,...)`
- **Texto**: `#FAF8F5` / `var(--color-text)` — muted: `rgba(250,248,245,0.55)` / `var(--color-text-muted)`
- **Bordes**: `var(--color-gold-border)` = `rgba(193,125,26,0.25)`
- **Texto SOBRE fondo oro** (íconos, labels): `#160D28` — nunca `#0C0C0C` ni negro puro

### Tipografía
**App/panel** (vía `next/font/google`, CSS vars en `globals.css`):
- `Cinzel` → `var(--font-display)` — h1/h2/h3, display (weights 400/600/700)
- `DM Sans` → `var(--font-body)` — body copy
- `Great Vibes` → `var(--font-script)` — decorativa

**Landing** (`route.ts` / `parte-2` — fuentes inline via Google Fonts):
- `Cormorant Garamond` — títulos serif, display, nombres (weights 300/400/600, itálica)
- `Montserrat` — eyebrows, labels, caps, botones (weights 400–700)
- `DM Sans` — body copy
- `Great Vibes` — decorativa puntual

### Prohibido
- Verde, azul, rojo externo. Sin excepciones.
- Colores viejos: `#0C0C0C`, `#EAB308`, `#CA8A04`, `#C4972A`, `rgba(196,151,42,...)`. Usar solo los de arriba.

---

## Arquitectura — archivos clave

### Frontend
```
src/app/globals.css                               — Variables CSS + tipografía base
src/app/layout.tsx                                — Fonts next/font, metadata
src/store/authStore.ts                            — Zustand auth (token + refreshToken + user)
src/lib/api.ts                                    — Todos los métodos HTTP por dominio
src/types/index.ts                                — Tipos TypeScript globales
src/components/layout/Sidebar.tsx                 — Nav condicional por rol

src/app/route.ts                                  — Landing principal "/" (HTML inline)
src/app/parte-2/page.tsx                          — Landing secundaria "/parte-2"
src/app/(auth)/login/page.tsx                     — Login
src/app/(auth)/register/page.tsx                  — Registro
src/app/dashboard/page.tsx                        — Dashboard alumno
src/app/dashboard/curso/page.tsx                  — Curso (módulos)
src/app/dashboard/agente-consultiva/page.tsx      — Chat IA Consultiva
src/app/admin/alumnos/page.tsx                    — Lista alumnos + activación de planes
src/app/admin/ranking/page.tsx                    — Ranking
src/app/admin/metricas/page.tsx                   — Métricas globales
```

### Backend
```
src/app.js                          — Registro de plugins y routes
src/middleware/auth.js              — requireAuth, requireAdmin, requireAdminOrClient, requireActiveSubscription
src/routes/auth.js                  — login, register, me, logout, refresh, forgot-password
src/routes/ia.js                    — chat IA, métricas post-chat
src/routes/courses.js               — GET /api/course (requiere suscripción activa)
src/routes/payments.js              — MercadoPago: VIP + renovación + webhook HMAC
src/routes/admin/users.js           — CRUD alumnos + activación planes
src/services/iaRouter.js            — Pipeline IA: Groq→Gemini→Claude→OpenAI→fallback
src/services/email.js               — Emails transaccionales
src/services/ranking.js             — Ranking (solo CONSULTIVA, peso 1.0)
prisma/schema.prisma                — Schema completo
```

## Roles y planes

| Rol | Acceso |
|-----|--------|
| `STUDENT` | Dashboard + IA (15 consultas/día) |
| `CLIENT` | Sin límite diario, sin check suscripción |
| `ADMIN` | Todo + panel de administración |

| Plan | Descripción |
|------|-------------|
| `TRIAL` | Acceso de prueba |
| `30_DAYS` | Plan mensual (USD 20) |
| `VITALICIO` | Acceso permanente |

## IA Consultiva
- **Pipeline**: Groq → Gemini (backupApiKey) → Claude (primaryApiKey) → OpenAI → fallback local
- **Modo**: tradicional — carga todos los documentos como contexto plano (sin RAG)
- **Groq**: máximo 5 chunks (límite 6k TPM)
- **ELIMINADOS**: COACH y MENTALIDAD — removidos de toda la codebase

---

## Patrones críticos — lecciones aprendidas

### Fetch autenticado (NO usar axios/api para pagos)
Los endpoints de pago usan `fetch` nativo. El token vive en `localStorage`, NO en cookies.
```ts
const token = localStorage.getItem('token')
await fetch(`${API_URL}/api/payments/...`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  },
  body: '{}',          // ← obligatorio aunque no haya datos, Fastify rechaza sin body
  credentials: 'include'
})
```

### reCAPTCHA — cobertura
- `/api/auth/register` ✓
- `/api/auth/login` ✓  
- `/api/auth/forgot-password` ✓
- `/api/payments/vip/create` ✓
- `/api/payments/renewal/create` ✗ eliminado — usuario ya autenticado, rate limit suficiente

### Rate limit — ventanas recomendadas
- Pagos VIP: 5 req / 10 min
- Renovación: 10 req / 1 min
- Chat IA: 30 req / 1 min por usuario

### Renovación 20 USD — flujo completo
1. Usuario con plan vencido entra → dashboard layout detecta `isExpired` → muestra `ExpiredPage`
2. `ExpiredPage` muestra botón "Renovar 20 USD" solo si `isPaidExpired` (`isExpired && !isTrial`)
3. Dashboard activo (plan 30_DAYS no vencido) muestra botón "Renovar ahora" para acumular días
4. Backend `/renewal/create` valida historial VIP (`subscription.planType = '30_DAYS'` o DNI en `Registro`)
5. Webhook detecta `ref.type === 'renewal'` → suma 30 días desde `activeUntil` vigente (intercalable)

### Activación manual de plan (admin)
En `/admin/alumnos` hay dos botones por alumno:
- **30 días**: activa plan `30_DAYS` desde hoy
- **Vitalicio**: activa plan `VITALICIO` permanente

### Seguridad — patrones activos
1. Filtrar siempre por `clientId: request.user.clientId` (nunca del body)
2. Logout revoca access token (Redis blacklist) + refresh token
3. Webhook MP verifica firma HMAC-SHA256 con `timingSafeEqual`
4. Knowledge base usa ORM Prisma (sin `$queryRawUnsafe`)
5. `escapeHtml` aplicado en todos los templates de email

---

## Skills Activos
- **consejero**: análisis adversarial. Activar con: `Usar skill consejero para [consulta]`

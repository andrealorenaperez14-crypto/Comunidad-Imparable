# EscuelaMPS — Snapshot del Codebase
> Actualizado: 2026-06-07 (sesión 14). Leer este archivo para retomar sin leer archivos individuales.

## Stack
- **Frontend:** Next.js 15 + React 19 + Tailwind 4 + Framer Motion + TanStack Query + Zustand (persist)
- **Backend:** Fastify 4 + Prisma 5 + PostgreSQL (Supabase) + Redis + JWT
- **Deploy:** Frontend → Vercel (`https://frontend-one-ivory-47.vercel.app/`), Backend → Render (`https://nucleo-estrategico-ia.onrender.com`)
- **Vercel CLI:** instalado globalmente, scope `escuela-de-asesores-mps-s-projects`, proyecto `frontend`

## Roles del sistema
| Rol | Acceso | Email |
|-----|--------|-------|
| `ADMIN` | Total | andrealorenaperez14@gmail.com |
| `CLIENT` | Panel admin completo, solo puede operar sobre STUDENTs de su clientId | yamilamansilla154@gmail.com |
| `STUDENT` | Dashboard personal (IA agents, ranking, certificados, curso) | — |

## Archivos clave (rutas rápidas)

### Frontend
```
src/store/authStore.ts          — Zustand auth store (persiste token + refreshToken + user)
src/lib/api.ts                  — Todos los métodos HTTP agrupados por dominio
src/types/index.ts              — Tipos TypeScript globales
src/components/layout/Sidebar.tsx — Nav condicional según rol + submenú módulos del curso

src/app/(auth)/login/page.tsx       — Login
src/app/(auth)/register/page.tsx    — Registro
src/app/page.tsx                    — Landing página 1 ✅ COMPLETADA
src/app/parte-2/page.tsx            — Landing página 2 ✅ COMPLETADA (ver sección abajo)
src/app/dashboard/page.tsx          — Dashboard alumno
src/app/dashboard/curso/page.tsx    — Curso con IDs por módulo para scroll desde sidebar
src/app/dashboard/agente-consultiva/page.tsx  — IA Consultiva + panel comisiones propias
src/app/admin/alumnos/page.tsx      — Lista alumnos + fecha ingreso + días restantes + botón copiar datos
src/app/admin/ranking/page.tsx      — Ranking + botón "Recalcular ahora"
src/app/admin/metricas/page.tsx     — Métricas
```

### Backend
```
src/app.js                          — Registro de todos los plugins y routes
src/middleware/auth.js              — requireAuth, requireAdmin, requireAdminOrClient, requireActiveSubscription
src/routes/auth.js                  — login, register, me, logout (revoca refresh token), refresh (verifica revocación)
src/routes/agents.js                — chat con IA, métricas post-chat
src/routes/courses.js               — GET /api/course — requiere suscripción activa ✅ SEGURO
src/routes/payments.js              — Mercado Pago: crear preferencia VIP + webhook con firma HMAC ✅
src/routes/commissions.js           — Comisiones del alumno
src/routes/admin/users.js           — students CRUD + fecha ingreso + suscripción completa
src/routes/admin/commissions.js     — Gestión admin de comisiones
src/routes/admin/agents.js          — CRUD agentes IA
src/routes/ranking.js               — top10 + student + POST /recalculate (admin)
src/services/iaRouter.js            — búsqueda knowledge base con ORM (sin SQL injection) ✅
prisma/schema.prisma                — Schema completo
```

### Docs importantes
```
docs/prompt-ia-coach.txt        — LUMA (IA Coach) — ADN escuela + Módulo 1 fichero + Módulo 2 caso Alejandro
docs/prompt-ia-mentalidad.txt   — ALMA (IA Mentalidad) — ADN + voz Yami + límites sin terapia
docs/prompt-ia-consultiva.txt   — NOVA (IA Consultiva) — ADN + fichero + cambio etario + solo base conocimiento
docs/google-apps-script-lista-vip.js — Script para Sheet VIP (ver instrucciones adentro)
docs/prompt-extraccion-gemini.txt   — Para extraer info de obras sociales con Gemini
docs/template-obra-social.txt       — Template para cargar knowledge base de la Consultiva
```

## Página 2 (`/parte-2`) — COMPLETADA ✅

### Sección Hero
- Logo Neuroventas con glow dorado 3D
- Título grande con "Internacional" en dorado + separador animado
- 4 badges: 30 días · 15 módulos · 2 mentorías · 24/7 IAs
- Card de impacto: "Escalá a +1.000 USD en 30 días"
- Texto: "↓ Anotate más abajo antes de que cierren los cupos"

### Sección Asesores ELITE (id="asesores-elite")
- Gancho precio: 150 USD con 80% dto → después 270 USD
- **Cotización MEP en tiempo real** desde `dolarapi.com/v1/dolares/mep`
- Formulario: nombre, email, WhatsApp → **Pagar con Mercado Pago**
- Post-pago: MP redirige a `/parte-2?pago=exitoso` o `?pago=fallido`
- Estado de éxito/falla mostrado automáticamente
- Botón "Sumarme al Club de Asesores VIP ORO" → WhatsApp `chat.whatsapp.com/Lvxh9N5rk6m6kz4Ks8lRGL` ✅

## Integración Mercado Pago (Lista VIP) ✅ DEPLOYADO

**Flujo:**
1. Usuario completa form → backend crea preferencia MP con monto en pesos (MEP del momento)
2. Redirige al checkout oficial de MP (tarjeta crédito/débito)
3. MP confirma → webhook → backend verifica firma HMAC → escribe en Google Sheet
4. Sheet recibe: Fecha y hora | Nombre | Email | WhatsApp | Monto Página | Cotización MEP | Monto Recibido | CONFIRMADO

**Variables de entorno en Render — todas cargadas ✅:**
| Variable | Estado |
|---|---|
| `MP_ACCESS_TOKEN` | ✅ |
| `MP_PUBLIC_KEY` | ✅ |
| `APPS_SCRIPT_VIP_URL` | ✅ |
| `BACKEND_URL` | ✅ `https://nucleo-estrategico-ia.onrender.com` |
| `MP_WEBHOOK_SECRET` | ✅ cargado (sesión 11) |

**Google Sheet:** `escueladeasesoresmps@gmail.com`
**Apps Script URL:** en variable de entorno del backend (no en el frontend)
**Apps Script local:** `docs/google-apps-script-lista-vip.js` — tiene la función `procesarComprobantes` para automatización Gmail también

## Ranking
- Cron medianoche: recalcula automáticamente
- Botón manual "Recalcular ahora" en admin → Ranking
- Incluye TODOS los alumnos (con o sin métricas — score 0 si no usaron IAs)
- Umbral: 0% (aparecen todos)

## Panel Admin — Alumnos
- Muestra: fecha de ingreso + días restantes (rojo si vencido, amarillo si ≤3 días)
- Badge "Vencido" en rojo para suscripciones expiradas
- Botón 📋 copiar datos: nombre, email, DNI, fecha ingreso, vencimiento, estado → portapapeles

## IAs — Prompts cargados en el admin ✅
| Agente | Nombre IA | Estado |
|---|---|---|
| COACH | LUMA | ✅ Cargado |
| MENTALIDAD | ALMA | ✅ Cargado |
| CONSULTIVA | NOVA | ✅ Cargado — solo base de conocimiento, sin internet |

## Flujo de carga — IA Consultiva (knowledge base)
1. Subir PDFs de la obra social a Gemini AI Studio + `docs/prompt-extraccion-gemini.txt`
2. Gemini llena el template (`docs/template-obra-social.txt`)
3. Pegar texto en panel admin → IA Consultiva → knowledge base

## Modelos DB relevantes (Prisma)
### SaleCommission — ciclo 21→20 de cada mes
### IAAgent — tipos: COACH | MENTALIDAD | CONSULTIVA

## UI / UX — cambios sesión 4
- **Sidebar header:** "Escuela de Asesores Elite for MPS" + "By Yami Mansilla" (dorado)
- **Sidebar módulos:** padding `py-1` (antes `py-2`) — 50% menos espacio entre ítems
- **Footer global:** "Desarrollado por: Núcleo Estratégico IA" — sidebar (bajo logout) + todos los paneles dashboard y admin (via layouts)
- **Mi Curso:** gap entre módulos `5rem` inline style (antes `space-y-16`)

## Performance — frontend (sesión 7)
- **`hooks/useChat.ts`**: `sendMessage` se recreaba en cada mensaje (`messages` en deps de `useCallback`). Fix: `useRef` para leer messages → `sendMessage` estable con solo `[agentId]` como dep, cero re-renders innecesarios en ChatInterface
- **`dashboard/curso/page.tsx`**: iframes YouTube sin `loading="lazy"` → cargaban el runtime de YouTube aunque el alumno no hubiera scrolleado. Agregado `loading="lazy"` en ambos iframes (free y paid)
- **No auditado/accionable**: React Query staleTime global 5min ✅, code splitting automático por ruta (App Router) ✅, fuentes self-hosted con next/font ✅, CSS custom properties sin duplicados ✅

## Performance — backend queries & caching (sesión 6)
- **`services/ranking.js`**: `include: { user: true }` → `select` solo campos necesarios (userId ya está en la métrica); loop de N `create` → `createMany` en 1 llamada
- **`middleware/auth.js` `requireActiveSubscription`**: cache Redis `sub:{userId}` con TTL 2min — evita query a DB en cada mensaje de chat. Valores: `ok` / `expired` / `none`
- **`cron/jobs.js` 10pm**: N `iAMetric.update` individuales → 2 `updateMany` agrupados por status (`ALERTA` / `EXCELENTE`) + emails en paralelo
- **`admin/users.js` ranking**: `iaMetrics` include tenía 3 registros por alumno pero solo usaba `[0]` → agregado `take: 1`

## Performance — backend & dependencias (sesión 5)
- **N+1 fix en `GET /api/ranking`**: antes hacía 1 `findMany` + 10 `findFirst` = 11 queries. Ahora: 1 `findMany` rankings + 1 `findMany` profiles (userId `in` array) = 2 queries. Archivo: `backend/src/routes/ranking.js`
- **Dependencias frontend removidas** (sin ningún uso en el código):
  - `date-fns` — 39 MB
  - `cmdk` — 124 KB
  - `vaul` — 204 KB
  - `qrcode.react` — 148 KB

## Performance — imágenes (sesión 4)
| Archivo | Antes | Después | Formato |
|---|---|---|---|
| `LOGO_NEUROVENTAS` | 3.8 MB | 156 KB | WebP |
| `LOGO_cuad_y_nombre` | 3.0 MB | 77 KB | WebP |
| `LOGO_y_nombre` | 569 KB | 26 KB | WebP |
| `yami-gemini` | 2.0 MB | 75 KB | WebP |
| 3 archivos sin uso | 3.2 MB | eliminados | — |

- `next.config.ts`: `formats: ['image/avif', 'image/webp']` — Next.js sirve AVIF en browsers modernos
- `priority` agregado en logos hero: `LOGO_cuad_y_nombre` (page.tsx) y `LOGO_NEUROVENTAS` (parte-2)
- Favicon cambiado a `LOGO_y_nombre_ESCUELA_DE_ASESORES.webp` (26 KB vs 3 MB antes)
- Verificado en producción: todos los assets responden HTTP 200, Content-Type correcto, pipeline `/_next/image` sirve AVIF

## Optimizaciones generales — sesión 10
- **`/health/ia` protegido**: agregado `requireAdmin` — antes cualquiera podía ver qué proveedores IA están activos
- **`Subscription @@index([userId, status])`**: índice compuesto aplicado en producción ✅ (vía Supabase MCP)
- **`DocumentChunk @@index([agentId, filename])`**: índice aplicado en producción ✅ (vía Supabase MCP)
- **`frontend/vercel.json`**: eliminada CSP duplicada — `next.config.ts` ya maneja los headers completos

## Seguridad — sesión 13
- **SQL injection — LIMPIO ✅**: cero `$queryRawUnsafe`/`$executeRawUnsafe`. Los 4 raw queries usan tagged templates Prisma (todos los `${}` se convierten en `$1`, `$2` parametrizados). El mensaje del chat del usuario llega como parámetro a `word_similarity` y `plainto_tsquery`, nunca concatenado.
- **XSS en emails — CORREGIDO ✅**: `email.js` tenía 20+ interpolaciones de datos de usuario en HTML sin escapar. Agregada función `h()` (escapa `&<>"'`) aplicada a `firstName`, `studentName`, `schoolName`, `agentName`, `otp`, `email`, `tempPassword`, `m.agentName`, `m.status` en los 8 templates.
- **Rate limiting agregado**: chat IA `30/min` por userId (keyGenerator decodifica JWT sin verificar, solo para clave), VIP create `5/10min` por IP.

## Ingresos VIP en panel admin (sesión 14)
- **`Subscription.amountPaid`**: nueva columna `FLOAT DEFAULT 0` aplicada en Supabase + schema.prisma actualizado
- **Webhook MP**: guarda `montoReal` en `amountPaid` al crear/renovar suscripción 30_DAYS
- **`admin/alumnos`**: muestra `💰 $X.XXX` en dorado para alumnos con `planType=30_DAYS` y `amountPaid > 0`
- **`admin/metricas`**: 2 cards nuevas — "Ingresos VIP" (suma total $) y "Alumnos VIP" (cantidad que pagaron con MP)
- **Fix dolarapi**: endpoint cambió de `/v1/dolares/mep` → `/v1/dolares/bolsa` (corregido en backend y parte-2)

## Flujo VIP completo (sesión 13)
- **`parte-2` formulario**: agrega campos Apellido y DNI (validación 7-8 dígitos)
- **Webhook MP**: escribe Sheet simplificado (fecha, nombre, DNI, email, WA, importe) + crea alumno nuevo con plan 30_DAYS y envía email con credenciales, o actualiza suscripción si el DNI ya existe
- **`email.js`**: nueva función `sendVIPWelcomeEmail` con contraseña temporal y link de ingreso
- **Apps Script**: simplificado a `doPost` con 6 columnas (sin automatización email)

## Seguridad — fixes sesión 9 (frontend)
- **`dashboard/certificados/page.tsx`**: `target="_blank"` sin `rel="noopener noreferrer"` en link "Verificar" → reverse tabnapping (nueva pestaña podía acceder a `window.opener`). Corregido.
- Auditado sin hallazgos: sin `dangerouslySetInnerHTML`, sin tokens hardcodeados, redirects solo a rutas internas, `localStorage` solo en authStore, CSP configurada en next.config.ts

## Seguridad — fixes sesión 8
- **`admin/agents.js` PUT — mass assignment**: `...rest` del body iba directo a `prisma.update` → whitelist explícita de campos editables (`name`, `description`, `icon`, `systemPrompt`, `instructions`, `metricsConfig`). Bloquea inyección de `clientId`, `published`, etc.
- **`admin/courses.js` — bypass blacklist Redis**: inline `jwtVerify()` no chequeaba tokens revocados → reemplazado con `requireAdmin`/`requireAdminOrClient` del middleware compartido
- **`admin/agents.js` interactions — limit sin cota**: `take: parseInt(limit)` sin máximo → `Math.min(100, ...)` para evitar dump total de la tabla

## Patrones de seguridad ✅ AUDITADOS (2026-06-07)
1. Filtrar siempre por `clientId: request.user.clientId` (nunca del body)
2. CLIENT role: verificar `user.role === 'STUDENT'` antes de operar
3. Delete cascade: SaleCommission → Certificate → IAMetric → IAInteraction → Subscription → Profile → User
4. Logout revoca access token (Redis blacklist) + refresh token (Redis `bl:rt:userId:iat`)
5. Webhook MP verifica firma HMAC-SHA256 con `timingSafeEqual`
6. `requireActiveSubscription` en todas las rutas de contenido de alumnos
7. Búsqueda knowledge base usa ORM Prisma (sin `$queryRawUnsafe`)

## Links WhatsApp definitivos ✅ (sesión 11)
- `parte-2`: Club VIP ORO → `chat.whatsapp.com/Lvxh9N5rk6m6kz4Ks8lRGL`
- `dashboard` + `expired`: → `chat.whatsapp.com/BkMTtbFbGwjAOsgD8pjUFH`
- `expired/page.tsx`: card WhatsApp — verde (#25D366) reemplazado por crema/dorado (paleta del proyecto)
- `MP_WEBHOOK_SECRET` cargado en Render ✅

## ⏳ PENDIENTE (próxima sesión)
1. **Mercado Pago** — hacer un pago de prueba real para confirmar webhook end-to-end (Sheet + creación de alumno en DB + email con credenciales)

## Commits recientes (sesión 2026-06-07 noche)
- `eb71255` feat: importe VIP en panel alumnos + métricas de ingresos VIP
- `46cb63c` fix: dolarapi endpoint mep → bolsa
- `66458dc` security: escapeHtml en todos los templates de email
- `c805d91` security: rate limiting chat 30/min + VIP create 5/10min
- `80c8688` feat: VIP flow completo — DNI+apellido en form, Sheet simplificado, crear/actualizar alumno en DB
- `a886b64` docs: índices DB aplicados en producción via Supabase MCP
- `da28c15` fix: expired page — verde WhatsApp → crema/dorado
- `e080c8c` feat: actualizar links WhatsApp definitivos
- `fbef2f6` security/perf: auth /health/ia + índices compuestos + fix CSP duplicada
- `d4c782a` security: noopener noreferrer en link verificar certificado
- `ae8e762` security: mass assignment agents PUT + blacklist courses + limit interactions
- `332e271` perf: useChat stable callback con useRef + lazy iframes YouTube en curso
- `2f6d296` perf: 4 optimizaciones backend (ranking, subscription cache, cron, admin)
- `639a848` perf: eliminar 4 deps sin uso (~39MB) + fix N+1 query ranking

## Commits sesión 2026-06-07 tarde
- `e94bc24` perf: convertir logos a WebP (-97%) y actualizar referencias
- `6ba12ec` perf: AVIF format, borrar imágenes sin uso, favicon más liviano
- `12cae97` fix: priority en logo hero landing página 1
- `610d842` fix: tilde en Núcleo + priority en logo hero página 2
- `9674af5` feat: renombrar escuela en sidebar + footer Núcleo Estratégico IA
- `a975d5f` fix: separación entre módulos con inline style (5rem)
- `4a161f7` fix: espaciado módulos sidebar al 50% + separar videos del curso

## Commits sesión 2026-06-07 mañana
- `33550ab` security: fix 5 vulnerabilidades
- `bca2bd1` fix: Suspense para useSearchParams en Next.js 15
- `35ff785` feat: espaciado módulos + submenú sidebar
- `80f0469` feat: integración Mercado Pago VIP
- `d50c19e` feat: automatización Gmail → Sheet
- `1338ffc` feat: rediseño visual hero página 2

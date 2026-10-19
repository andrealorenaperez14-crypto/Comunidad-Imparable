# Academia Comunidad Imparable — Snapshot del Codebase
> Actualizado: 2026-10-19. Leer este archivo para retomar sin leer archivos individuales.

## Stack
- **Frontend:** Next.js 15 + React 19 + Tailwind 4 + Framer Motion + TanStack Query + Zustand (persist)
- **Backend:** Fastify 4 + Prisma 5 + PostgreSQL (Supabase) + Redis + JWT
- **Deploy:** Frontend → Vercel (`https://comunidad-imparables.vercel.app`), Backend → Render
- **Repo:** andrealorenaperez14-crypto/comunidad-imparable

## Roles del sistema
| Rol | Acceso |
|-----|--------|
| `ADMIN` | Total + panel de administración |
| `CLIENT` | Panel admin, opera solo sobre STUDENTs de su clientId. Sin límite de IA. |
| `STUDENT` | Dashboard personal. Límite 15 consultas/día a IA Consultiva. |

## Archivos clave (rutas rápidas)

### Frontend
```
src/store/authStore.ts                            — Zustand auth (token + refreshToken + user)
src/lib/api.ts                                    — Todos los métodos HTTP por dominio
src/types/index.ts                                — Tipos TypeScript globales
src/components/layout/Sidebar.tsx                 — Nav condicional por rol

src/app/route.ts                                  — Landing principal "/" (HTML estático inline)
src/app/parte-2/page.tsx                          — Landing secundaria "/parte-2"
src/app/(auth)/login/page.tsx                     — Login
src/app/(auth)/register/page.tsx                  — Registro
src/app/dashboard/page.tsx                        — Dashboard alumno
src/app/dashboard/curso/page.tsx                  — Curso (módulos con scroll desde sidebar)
src/app/dashboard/agente-consultiva/page.tsx      — Chat IA Consultiva
src/app/admin/alumnos/page.tsx                    — Lista alumnos + activación de planes
src/app/admin/ranking/page.tsx                    — Ranking (solo columna Consultiva)
src/app/admin/metricas/page.tsx                   — Métricas globales (solo Consultiva)
```

### Backend
```
src/app.js                          — Registro de plugins y routes
src/middleware/auth.js              — requireAuth, requireAdmin, requireAdminOrClient, requireActiveSubscription
src/routes/auth.js                  — login, register, me, logout, refresh, forgot-password
src/routes/ia.js                    — chat IA, métricas post-chat
src/routes/courses.js               — GET /api/course (requiere suscripción activa)
src/routes/payments.js              — MercadoPago: VIP + renovación + webhook HMAC
src/routes/commissions.js           — Comisiones del alumno
src/routes/admin/users.js           — CRUD alumnos + activación planes (30d / vitalicio)
src/routes/admin/agents.js          — CRUD agentes IA
src/routes/ranking.js               — top10 + student + POST /recalculate (admin)
src/routes/health.js                — Health check (requiere admin)
src/services/iaRouter.js            — Pipeline IA: Groq→Gemini→Claude→OpenAI→fallback
src/services/email.js               — Emails transaccionales (Nodemailer / Gmail)
src/services/ranking.js             — Cálculo ranking (solo CONSULTIVA, peso 1.0)
src/services/certificates.js        — Generación PDF certificados
prisma/schema.prisma                — Schema completo
prisma/seed.js                      — Seed de datos iniciales
```

### Docs
```
docs/prompt-ia-consultiva.txt       — Prompt sistema IA Consultiva
docs/template-obra-social.txt       — Template para cargar knowledge base
docs/google-apps-script-lista-vip.js — Script Google Sheet VIP
```

## IA Consultiva — única IA activa

| Propiedad | Valor |
|-----------|-------|
| Tipo | `CONSULTIVA` |
| Modo | Tradicional (sin RAG) — carga todos los chunks como contexto plano |
| Pipeline | Groq → Gemini (backupApiKey) → Claude (primaryApiKey) → OpenAI → fallback local |
| Groq | Recibe máximo 5 chunks (límite 6k TPM) |
| STUDENT | 15 consultas/día |
| CLIENT/ADMIN | Sin límite |

**ELIMINADOS**: COACH y MENTALIDAD — removidos de toda la codebase (tipos, ranking, métricas, admin).

## Ranking
- Peso: `CONSULTIVA: 1.0` (único agente)
- Cron medianoche: recalcula automáticamente
- Botón manual "Recalcular ahora" en `/admin/ranking`
- Incluye todos los alumnos (score 0 si no usaron IA)

## Pagos — MercadoPago
- **VIP**: USD 20 inscripción → preferencia MP → webhook HMAC-SHA256 → crea alumno plan `30_DAYS`
- **Renovación**: USD 20/mes → suma 30 días desde `activeUntil` vigente (intercalable)
- Webhook verifica firma con `timingSafeEqual`
- Títulos: "Lista VIP ELITE — Academia Comunidad Imparable" / "Renovación Mensual — Academia Comunidad Imparable"

## Panel Admin — Alumnos (`/admin/alumnos`)
- Fecha de ingreso + días restantes (rojo si vencido, amarillo si ≤3 días)
- Badge "Vencido" en rojo
- Botón **30 días**: activa plan `30_DAYS` desde hoy
- Botón **Vitalicio**: activa plan `VITALICIO` permanente
- Botón 📋 copiar datos: nombre, email, DNI, fecha ingreso, vencimiento, estado

## Branding — dos sistemas
Ver `CLAUDE.md` → sección "Branding — dos sistemas" para referencia completa.

**Landing** (`route.ts` / `parte-2`): púrpura `#160D28`, oro `#C17D1A`, fuentes Cormorant Garamond / Montserrat / DM Sans.

**App/Panel**: negro `#0C0C0C`, oro `#EAB308` / `#CA8A04`, CSS vars `var(--color-gold)` / `var(--color-bg)`.

## Seguridad — patrones activos
1. Filtrar siempre por `clientId: request.user.clientId` (nunca del body)
2. CLIENT role: verificar `user.role === 'STUDENT'` antes de operar
3. Logout revoca access token (Redis blacklist) + refresh token (`bl:rt:userId:iat`)
4. Webhook MP verifica firma HMAC-SHA256 con `timingSafeEqual`
5. `requireActiveSubscription` en todas las rutas de contenido de alumnos
6. Knowledge base usa ORM Prisma (sin `$queryRawUnsafe`)
7. `escapeHtml` aplicado en todos los templates de email
8. Rate limit: chat IA 30/min por userId, VIP create 5/10min por IP
9. `/health/ia` protegido con `requireAdmin`

## Performance — optimizaciones aplicadas
- `useChat.ts`: `sendMessage` estable con `useRef` (sin re-renders por cambio de messages)
- Iframes YouTube con `loading="lazy"` en curso
- Redis cache `sub:{userId}` TTL 2min en `requireActiveSubscription`
- Ranking: `createMany` en lugar de loop de `create`
- Admin users ranking: `take: 1` en `iaMetrics` include
- Índices DB: `Subscription @@index([userId, status])` + `DocumentChunk @@index([agentId, filename])`
- Assets WebP (logos optimizados -97%)

## Commits recientes (Octubre 2026)
- `a9992c7` docs: add full branding + typography systems to CLAUDE.md
- `ac7f912` docs: rewrite README.md for Academia Comunidad Imparable
- `89d7ba5` docs: update CONTEXT.md with current client info
- `2ea3caf` refactor: remove RAG, switch IA Consultiva to traditional flat-context mode
- `efe0a06` rebrand: Academia Comunidad Imparable — emails, pagos, ranking, admin, health
- (anteriores: rebrand frontend, fix JSX parte-2, remove COACH/MENTALIDAD)

## Variables de entorno requeridas (Backend)
| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL (Supabase) |
| `REDIS_URL` | Redis |
| `JWT_SECRET` | Secreto JWT (mín. 32 chars) |
| `JWT_REFRESH_SECRET` | Secreto refresh token |
| `ENCRYPTION_KEY` | AES-256 (exactamente 32 chars) |
| `GROQ_API_KEY` | Groq (IA principal) |
| `ANTHROPIC_API_KEY` | Claude (fallback IA — también en `primaryApiKey` del agente) |
| `OPENAI_API_KEY` | OpenAI (fallback IA) |
| `MP_ACCESS_TOKEN` | MercadoPago access token |
| `MP_PUBLIC_KEY` | MercadoPago public key |
| `MP_WEBHOOK_SECRET` | Secreto HMAC webhook MP |
| `GMAIL_USER` | Gmail sender |
| `GMAIL_APP_PASSWORD` | Gmail app password |
| `CORS_ORIGIN` | URL del frontend |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v2 |
| `BACKEND_URL` | URL pública del backend (para webhook MP) |

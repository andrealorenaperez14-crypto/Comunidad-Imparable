# EscuelaMPS — Snapshot del Codebase
> Actualizado: 2026-05-24 (sesión 2). Leer este archivo para retomar sin leer archivos individuales.

## Stack
- **Frontend:** Next.js 15 + React 19 + Tailwind 4 + Framer Motion + TanStack Query + Zustand (persist)
- **Backend:** Fastify 4 + Prisma 5 + PostgreSQL (Supabase) + Redis + JWT
- **Deploy:** Frontend → Vercel (`https://frontend-one-ivory-47.vercel.app/`), Backend → Render
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
src/components/layout/Sidebar.tsx — Nav condicional según rol

src/app/(auth)/login/page.tsx       — Login (botón "← Volver al INICIO" fijo top-right)
src/app/(auth)/register/page.tsx    — Registro (sin carácter especial, confirmar pwd con ojo)
src/app/page.tsx                    — Landing página 1 (TODA editada - ver sección abajo)
src/app/parte-2/page.tsx            — Landing página 2 (15 módulos Elite - ver sección abajo)
src/app/dashboard/page.tsx          — Dashboard alumno
src/app/dashboard/agente-consultiva/page.tsx  — IA Consultiva + panel comisiones propias
src/app/admin/alumnos/page.tsx      — Lista alumnos + modal comisiones + reset pwd + delete
src/app/admin/ranking/page.tsx      — Ranking con filtros suscripción/status/búsqueda
src/app/admin/metricas/page.tsx     — Métricas: gráficas + tabla ranking+comisiones por alumno
```

### Backend
```
src/app.js                          — Registro de todos los plugins y routes
src/middleware/auth.js              — requireAuth, requireAdmin, requireAdminOrClient
src/routes/auth.js                  — login, register, me, logout, refresh, forgot/reset pwd
src/routes/agents.js                — chat con IA, métricas post-chat
src/routes/commissions.js           — Comisiones del alumno (list/create/delete own)
src/routes/admin/users.js           — students CRUD, delete cascade, ranking
src/routes/admin/commissions.js     — Gestión admin de comisiones + summary por ciclo
src/routes/admin/agents.js          — CRUD agentes IA + knowledge upload + publish
prisma/schema.prisma                — Schema completo (User, Client, SaleCommission, IAMetric, etc.)
```

## Estado actual de las LANDING PAGES

### Página 1 (`/`) — page.tsx — COMPLETADA ✅
**Hero:**
- Título: "¿Vas a seguir siendo un Vendedor Tradicional o das el salto a **Asesor de Elite en el Rubro Salud**?" (dorado el final, tamaño reducido)
- Subtítulo: "Ayudamos a asesores/profesionales a escalar a **+1.000 USD por mes**, implementando Neuroventas con la IA entregada como tu socio."
- Card Reto 3 Días: desc actualizada + botón "EMPEZAR RETO GRATIS" + nota "Acceso por ÚNICA vez"
- Card En 30 Días: desc con "MÉTODO exclusivo para el Rubro SALUD, de Yami Mansilla" + botón "QUIERO SABER MÁS"

**Secciones:**
- MANIFIESTO ("Por qué esto importa ahora"): frase eliminada
- IAs: subtítulo en 2 líneas + IA Mentalidad y IA Consultiva (+10.000) actualizados
- Stats: +10.000 Clientes, 13 Años, +1.000 Asesores, +40.000 USD/año
- Título stats: "De 0 a +10.000 Clientes. Rompiendo todos los Esquemas."
- Yami: "A los 16 años, trabajé como asesora," + valores Honestidad/Movimiento/Servicio actualizados
- Módulos: "Solo se aprende haciendo" + "Todo va a ser NO, buscamos el SÍ"
- Pricing: "ASESOR ELITE en el RUBRO SALUD", sin "Precio lanzamiento", botón "QUIERO SABER MÁS", "Gana +1.000 USD en 30 días"
- FAQ: 4 preguntas (eliminadas "¿Qué pasa si no cierro?" y "¿Qué horarios IAs?")
- Cierre Yami: sin comillas, 2 líneas, "en el Rubro Salud"
- Botón final: "COMIENZA AHORA"
- Footer: "© 2026 Escuela de Asesores en el Rubro Salud"

### Página 2 (`/parte-2`) — parte-2/page.tsx — EN PROGRESO 🔄
**Hecho:**
- Botones top-right: "← Volver al INICIO" + "Iniciar Sesión"
- Hero: "+1.000 USD en 30 días / o seguí como asesor tradicional"
- IA Mentalidad: texto actualizado
- Subtítulo módulos: "Certificación Internacional en Neuroventas / Aplicadas al consumidor de coberturas médicas"
- Secciones eliminadas: MANIFIESTO y CIERRE YAMI (ya están en página 1)

**PENDIENTE página 2:** el usuario dijo que tiene más cambios → retomar mañana

## Modelos DB relevantes (Prisma)

### SaleCommission
```prisma
model SaleCommission {
  id          String    @id @default(cuid())
  userId      String
  clientId    String
  amount      Float
  description String?
  saleDate    DateTime
  cycleStart  DateTime   // 21 del mes
  cycleEnd    DateTime   // 20 del mes siguiente
  isPaid      Boolean    @default(false)
  paidDate    DateTime?
  source      String     @default("MANUAL")
  externalRef String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

### Ciclo de comisiones
- Ciclo: día 21 al día 20 del mes siguiente
- Si `saleDate.day >= 21` → cycleStart = 21 del mes actual
- Si `saleDate.day < 21` → cycleStart = 21 del mes anterior

## Patrones de seguridad CRÍTICOS
1. **Siempre** filtrar por `clientId: request.user.clientId` (del JWT, nunca del body)
2. CLIENT role: verificar `user.role === 'STUDENT'` antes de operar
3. Delete cascade manual: SaleCommission → Certificate → IAMetric → IAInteraction → Subscription → Profile → User

## Score de ranking (IA Coach)
```
score = (engagementScore × 0.4 + completionRate × 0.3 + problemResolutionRate × 0.3) × 100
status = EXCELENTE | BUENO | ALERTA
```

## API Frontend — métodos por dominio
```typescript
authApi          — login, register, me, logout, refresh, forgotPassword, resetPassword
subscriptionApi  — status, upgrade, cancel, history
agentApi         — list, chat, metrics, reports
metricsApi       — student, dashboard, generateReport, uploadParams
rankingApi       — top10, student
adminAgentApi    — list, create, update, uploadKnowledge, interactions, publish
adminCourseApi   — list, create, update, remove
adminUserApi     — search, resetPassword, resetStudentPassword, students, deleteStudent, ranking
commissionApi    — list, create, remove   (alumno propio)
adminCommissionApi — list, create, markPaid, remove, summary(cycleStart?)
certificateApi   — list, verify, download
```

## Commits recientes (sesión 2026-05-23/24)
- `b9859f3` feat: cambios página 2 - hero y subtítulo módulos
- `0bb2c48` fix: botón recuadro Asesor Elite → QUIERO SABER MÁS
- `0dde2ec` fix: botón En 30 Días → QUIERO SABER MÁS
- `8396c2e` feat: ajustes finales página 1
- `e52a69f` feat: actualización de textos página 1 + página 2 + UX
- `a3dba59` feat: botón fijo "Volver al INICIO" en login, registro y página 2
- `5548366` fix: botones CTA dentro de cada recuadro en hero de página 1
- `48c9b8a` fix: registro sin carácter especial + confirmar pwd con ojo
- `afd0620` feat: comisiones, ranking, delete cascade + UI fixes

## OBLIGATORIO antes de deploy backend
```bash
cd backend && npm run db:generate   # ✅ HECHO 2026-05-24 — usar npm run db:generate (NO npx, descarga v7)
```

## Pendiente de implementar
- **Página 2:** más cambios pendientes (el usuario los pasa cuando quiera)

## Flujo de carga — IA Consultiva (knowledge base)
Sin integración a Drive. El flujo es manual asistido por IA:
1. Subir PDFs/planillas de la obra social a Gemini AI Studio junto con `docs/prompt-extraccion-gemini.txt`
2. Gemini extrae la info y llena el template (`docs/template-obra-social.txt`)
3. Pegar el texto extraído como knowledge base desde el panel admin → IA Consultiva

# ESCUELA DIGITAL ELITE — CONTEXTO CLAUDE CODE
**Owner:** Andrea | **Go-live:** 17/5/2026 | **Stack:** Next.js15 + Fastify + Supabase + Prisma + Redis

---

## REGLAS FIJAS (NO NEGOCIAR)
- **$0/mes**: Supabase, Vercel, Render, Resend, Sentry, PostHog, Cloudflare free tiers.
- **Sin chat público, sin comunidad, sin posts** — solo IA privada 1-on-1.
- **Responsive web only.** Solo español latino. Legal: templates open source.
- **MVP = 1 cliente.** Arquitectura multitenant desde inicio.

---

## ARQUITECTURA MULTITENANT
Todo filtrado por `clientId` + RLS. Nuevo cliente: clone → DB → variables → agents → branding → deploy (30-60 min).

**Variables globales:** `tiempo_free=5d | dias_activo=30 | cuenta_regresiva=5d | dias_guardado=10 | tiempo_informe=weekly | actualiza_ranking=daily`

**Client.settings:** `{ "nombre_escuela":"...", "X_ranking":10, "base_ingreso":70, "X_retos":5, "charla_cafe":false }`

**Client.branding:** `{ "primaryColor":"#...", "secondaryColor":"#...", "logo":"url", "favicon":"url" }`

---

## CLIENTE 1 — ESCUELA DE ASESORES

### Identidad
```
nombre_escuela:  "Escuela de Asesores"
tagline:         "Rompe Todos los Esquemas"
subtitulo:       "Formamos Líderes, No Vendedores. Transformamos Vidas, No Solo Negocios."
fundadora:       Yami Mansilla — "Visionaria · Empresaria · Capacitadora"
frase:           "No sigo tendencias, las creo."
seccion_paga:    "Neuroventas" + logo B.I.I.A. (Business and Innovation Institute of America)
seccion_free:    sin título ni logo
dominio:         TBD
```

### Colores
```
--color-bg:          #0C0C0C
--color-bg-card:     #141414
--color-gold:        #C4972A
--color-gold-light:  #D4A843
--color-gold-dark:   #8B6914
--color-gold-border: rgba(196,151,42,0.25)
--color-text:        #F5F0E8
--color-text-muted:  #8A8A7A
--color-separator:   rgba(196,151,42,0.15)
```

### Tipografía
```
Display/Headings: 'Cinzel' (Google Fonts) — serif institucional, mayúsculas
Script/Firma:     'Great Vibes' (Google Fonts) — nombre Yami Mansilla
Body:             'DM Sans'
NUNCA: Inter, Roboto, Arial
```

### Logos (copiar a frontend/public/assets/client1/)
```
LOGO_SOLO_ESCUELA_DE_ASESORES.png      → favicon + ícono nav
LOGO_y_nombre_ESCUELA_DE_ASESORES.png  → header desktop
LOGO_NEUROVENTAS.png                   → sección paga + certificados
LOGO_1_YAMI_MANSILLA.png               → escudo YM (marca personal)
LOGO_2_YAMI_MANSILLA.png               → firma cursiva Yami
YAMI_MANSILLA_MARCA_PERSONAL.png       → página about / hero fundadora
```

### Secciones
```
FREE (5d):           material base | IAs activas desde día 1 | sin branding especial
PAID — NEUROVENTAS:  logo Neuroventas/BIIA | capacitación alto impacto | certificación | 3 IAs 24/7
```

---

## TRIPLE IA AGENTS (MVP cliente 1 — base soporta N agentes por clientId)

| Agente | Cuándo | Propósito | Primario | Backup | Fallback |
|---|---|---|---|---|---|
| IA COACH | Durante aprendizaje | Acompañar proceso de estudio | Claude Sonnet | Gemini Advanced | OpenAI GPT-4 |
| IA MENTALIDAD | Durante y post aprendizaje | Miedos y bloqueos personales | Claude Sonnet | Gemini Advanced | OpenAI GPT-4 |
| IA CONSULTIVA | Durante y post venta | Ventas, cierre, carga de datos | Gemini Pro | Claude Sonnet | Local search |

**Propuesta diferencial:** "Primera plataforma donde todo el proceso de aprendizaje y venta es asistido por IAs integradas. El alumno nunca está solo." Disponibles 24/7.

**Flujo alumno:**
```
Ingreso → [IA Coach activa] → Estudio + [IA Mentalidad disponible] →
Certificación → Trabajo en campo → [IA Consultiva activa] + [IA Mentalidad disponible]
```

**DB — actualizar:** IAAgent.type: `'COACH' | 'MENTALIDAD' | 'CONSULTIVA'` (reemplaza CONSULTIVO | MENTOR). @@unique([clientId, type]) soporta los 3.

---

## USUARIOS & SUSCRIPCIÓN
**El DNI es el identificador único e irremplazable del usuario.** Valida continuidad, reingreso, historial de pagos y acceso. Un mismo DNI no puede tener dos cuentas. Si el usuario vuelve a registrarse después de que venció su acceso, el sistema lo reconoce por DNI y le asigna el plan correcto.
Roles: ADMIN | STUDENT | CLIENT.

**Lifecycle:** FREE(5d) → acceso vence → página /expired → puede comprar Elite (150 USD, una vez). PAID(30d) → acceso vence → página /expired → puede renovar (20 USD/mes, intercalable, cada pago activa 30 días desde la fecha de pago). No hay suspensión ni eliminación automática de datos. El usuario puede volver cuando quiera pagando la renovación.

---

## MÉTRICAS & ALERTAS
Score <60%: email alumno + cliente + dashboard. Inactividad 3d: motivacional + alerta. Score >90%: felicitación + reporte. Semanal compilado. Score = engagement × completion × evaluation. Top 10 diario.

---

## EMAILS (vía Resend)
Welcome | Low perf ×2 | High perf ×2 | Inactividad | Semanal. Max 2/día/alumno. Unsubscribe obligatorio. No hay emails de countdown ni suspensión — el acceso vence y el usuario renueva por su cuenta desde /expired.

---

## CERTIFICADOS
PDF auto. Logo Neuroventas + B.I.I.A. Serial único verificable. Email automático post-completación.

---

## DB SCHEMA
```
User(id,email,passwordHash,role,clientId,dni)
Client(id,name,domain,branding:Json,settings:Json)
Subscription(userId,planType,status,activeUntil,suspensionDate)
IAAgent(clientId,type:COACH|MENTALIDAD|CONSULTIVA,systemPrompt,instructions,knowledgeBase,primaryApiKey,backupApiKey,published)
IAInteraction(agentId,userId,message,response,modelUsed,tokens,cost,duration)
IAMetric(agentId,userId,[métricas según tipo],status:EXCELENTE|BUENO|ALERTA)
Ranking(clientId,position,userId,totalScore,gainPercentage,daysInTop10)
Certificate(serialNumber,userId,courseId,issueDate,pdfUrl,status)
CourseContent(clientId,type:FREE|PAID,title,description,content,order)
StudentsPrevious(dni,clientId,lastEmail,lastMetrics,completedCourses,archivedAt)
```
RLS + indexes por clientId, userId, email, activeUntil en todas las tablas.

---

## API
```
POST /api/auth/login|register|logout|refresh | GET /api/auth/me
GET|POST /api/subscription/status|upgrade|cancel|history
GET|POST|PUT /api/admin/agents(/:id) | POST knowledge|publish | GET interactions
POST /api/agents/:id/chat | GET /api/agents/:id/metrics|reports
GET /api/metrics/student/:id | GET /api/metrics/dashboard | POST /api/metrics/generate-report
GET /api/ranking | GET /api/ranking/student/:id
GET /api/certificates/:studentId | POST /api/certificates/:id/download
GET /health
```

## CRON
`00:00 ranking | 06:00 suscripciones | 08:00 inactividad | 22:00 rendimiento | 09:00L reportes`

## NO FASE 2
Chat público · posts · comunidad · webhooks · multi-idioma · apps nativas · white-label · custom domains

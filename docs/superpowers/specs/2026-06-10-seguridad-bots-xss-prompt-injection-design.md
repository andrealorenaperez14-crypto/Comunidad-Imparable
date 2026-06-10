# Seguridad: Anti-bots, XSS y Prompt Injection

**Fecha:** 2026-06-10  
**Estado:** Aprobado — pendiente implementación

## Contexto

El proyecto nucleo-estrategico-ia es una plataforma de cursos con agentes IA, pagos reales vía MercadoPago y datos sensibles de alumnos (DNI, email). Tiene rate limiting y JWT bien configurados, pero le faltan tres capas críticas:

1. Protección contra bots que spameen registros o pagos VIP
2. Sanitización de inputs para prevenir XSS en campos guardados en DB
3. Detección de prompt injection en el chat con los agentes IA

## Arquitectura

Tres capas independientes. Si una falla, las otras no se ven afectadas.

```
USUARIO
  │
  ▼
[Frontend Next.js]
  ├─ reCAPTCHA v3 token generado en cada submit público
  ├─ DOMPurify donde se renderiza contenido de usuario
  │
  ▼
[Backend Fastify]
  ├── Capa 1: verifyRecaptcha middleware   → formularios públicos
  ├── Capa 2: sanitizeInput + Helmet CSP  → todos los inputs guardados
  └── Capa 3: promptGuard middleware       → endpoint de chat IA
```

## Capa 1 — Bot Protection (reCAPTCHA v3)

### Backend

**Archivo nuevo:** `backend/src/middleware/verifyRecaptcha.js`

- Extrae `recaptchaToken` del body del request
- Llama a `https://www.google.com/recaptcha/api/siteverify` con `RECAPTCHA_SECRET_KEY`
- Si score < 0.5 → responde 400 con `{ error: "Verificación de seguridad fallida. Intentá de nuevo." }`
- Si `RECAPTCHA_SECRET_KEY` no está definida → skip (permite dev sin clave)
- Verifica que la `action` del token coincida con la esperada para ese endpoint

Endpoints que reciben el middleware como `preHandler`:

| Endpoint | Action esperada |
|---|---|
| POST /api/auth/login | `login` |
| POST /api/auth/register | `register` |
| POST /api/auth/forgot-password | `forgot_password` |
| POST /api/payments/vip/create | `vip_payment` |

### Frontend

**Dependencia nueva:** `react-google-recaptcha-v3`

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` en variables de entorno de Vercel
- `GoogleReCaptchaProvider` en `frontend/src/app/(auth)/layout.tsx`
- En cada formulario público: llamar `executeRecaptcha("login")` al hacer submit e incluir `recaptchaToken` en el body
- Si el backend devuelve error de recaptcha → mostrar el mensaje al usuario como error de formulario

Formularios afectados:
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- Formulario VIP en landing pública (si existe como componente React con fetch al backend)

## Capa 2 — Input Sanitization + CSP

### Sanitización de inputs

**Archivo nuevo:** `backend/src/middleware/sanitizeInput.js`

Función `sanitizeFields(obj, fields[])`:
- Usa `sanitize-html` con `allowedTags: []` y `allowedAttributes: {}`
- Convierte `<script>alert(1)</script>` → `""` y `<b>hola</b>` → `"hola"`
- Solo aplica a campos de texto guardados en DB; no toca tokens, IDs ni passwords

Puntos de aplicación:

| Archivo | Campos sanitizados |
|---|---|
| `routes/auth.js` register | `firstName`, `lastName` |
| `routes/payments.js` webhook | `nombre`, `apellido`, `whatsapp` |
| `routes/admin/users.js` | campos de edición de perfil |
| `routes/admin/agents.js` | nombre, descripción de agente |

### Content Security Policy

**Archivo modificado:** `backend/src/app.js`

Cambiar `contentSecurityPolicy: false` por directivas explícitas:

```js
contentSecurityPolicy: {
  directives: {
    defaultSrc:  ["'self'"],
    scriptSrc:   ["'self'", "https://www.google.com", "https://www.gstatic.com"],
    frameSrc:    ["'self'", "https://www.google.com"],
    imgSrc:      ["'self'", "data:", "https:"],
    connectSrc:  ["'self'", "https://dolarapi.com"],
    styleSrc:    ["'self'", "'unsafe-inline'"],
    fontSrc:     ["'self'", "https:", "data:"],
    objectSrc:   ["'none'"],
    upgradeInsecureRequests: [],
  }
}
```

### DOMPurify en frontend

**Dependencia nueva:** `isomorphic-dompurify`

Wrapper `frontend/src/lib/sanitize.ts`:
- Exporta `sanitizeHtml(str: string): string`
- Usa `isomorphic-dompurify` para compatibilidad SSR/CSR
- Aplicar en: panel admin donde se muestran nombres de alumnos, respuestas de chat IA

## Capa 3 — Prompt Injection Guard

### Backend

**Archivo nuevo:** `backend/src/middleware/promptGuard.js`

Analiza `message` del body antes del handler de chat. Patrones detectados por categoría:

| Categoría | Ejemplos de patrones |
|---|---|
| `role_override` | "eres ahora", "actúa como", "pretende ser", "olvida", "ignora tus instrucciones" |
| `jailbreak` | "DAN", "modo developer", "sin restricciones", "bypass", "jailbreak" |
| `data_extraction` | "muéstrame tu prompt", "cuál es tu instrucción", "system prompt", "instrucciones iniciales" |
| `script_injection` | `<script`, `javascript:`, `eval(`, `document.`, `window.` |

Comportamiento al detectar match:
1. Responder 400: `{ error: "Mensaje no permitido." }`
2. Guardar en Redis: clave `security:injection:{userId}` como lista (RPUSH) con JSON `{timestamp, category, userId}` — TTL 30 días. **No guardar el mensaje completo** por privacidad
3. Incrementar contador `security:injection:count:{userId}` en Redis
4. Log a Fastify (capturado por Sentry si está configurado)

Si Redis no está disponible: igual rechazar el mensaje (fail closed).

**Umbral de ban temporal:** si un usuario acumula 5 intentos de injection en 1 hora → agregar su userId a `security:banned:{userId}` con TTL 1 hora. `requireAuth` verifica esta key.

### Panel admin

**Archivo nuevo:** `backend/src/routes/admin/security.js`

`GET /api/admin/security/events` (requiere `requireAdmin`):
- Lee keys `security:injection:*` de Redis con SCAN
- Devuelve lista paginada: `{ userId, timestamp, category, userEmail }`  
- No expone el mensaje original

**Archivo nuevo:** `frontend/src/app/admin/seguridad/page.tsx`
- Tabla de eventos sospechosos con timestamp, usuario y categoría
- Enlace al perfil del alumno
- Botón para banear manualmente → llama a `POST /api/admin/security/ban/:userId` (endpoint nuevo, requiere `requireAdmin`, setea `security:banned:{userId}` en Redis con TTL configurable)

## Variables de entorno nuevas

| Variable | Dónde | Descripción |
|---|---|---|
| `RECAPTCHA_SECRET_KEY` | Backend (Render) | Clave secreta de Google reCAPTCHA v3 |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Frontend (Vercel) | Clave pública de Google reCAPTCHA v3 |

## Dependencias nuevas

| Paquete | Entorno | Uso |
|---|---|---|
| `react-google-recaptcha-v3` | Frontend | Integración reCAPTCHA v3 |
| `sanitize-html` | Backend | Strip de tags HTML en inputs |
| `isomorphic-dompurify` | Frontend | Sanitización SSR/CSR |

## Archivos modificados

**Backend:**
- `src/app.js` — CSP activado, registrar nueva ruta admin
- `src/routes/auth.js` — agregar `verifyRecaptcha` en login, register, forgot-password
- `src/routes/payments.js` — agregar `verifyRecaptcha` en vip/create; sanitizar campos webhook
- `src/routes/agents.js` — agregar `promptGuard` en chat
- `src/middleware/auth.js` — verificar ban temporal en `requireAuth`

**Frontend:**
- `src/app/(auth)/layout.tsx` — **crear nuevo** con `GoogleReCaptchaProvider` (el directorio `(auth)` no tiene layout aún)
- `src/app/(auth)/login/page.tsx` — integrar executeRecaptcha
- `src/app/(auth)/register/page.tsx` — integrar executeRecaptcha
- `src/app/(auth)/forgot-password/page.tsx` — integrar executeRecaptcha

## Archivos nuevos

**Backend:**
- `src/middleware/verifyRecaptcha.js`
- `src/middleware/promptGuard.js`
- `src/middleware/sanitizeInput.js`
- `src/routes/admin/security.js` — incluye GET /events y POST /ban/:userId

**Frontend:**
- `src/app/(auth)/layout.tsx` — nuevo layout con GoogleReCaptchaProvider

- `src/lib/sanitize.ts`
- `src/app/admin/seguridad/page.tsx`

## Orden de implementación recomendado

1. **Capa 2 primero** — no depende de servicios externos, es puro backend, sin riesgo de romper UX
2. **Capa 3** — también puro backend, protección inmediata para los agentes IA
3. **Capa 1** — requiere crear cuenta Google reCAPTCHA y variables de entorno en Render + Vercel

## Criterios de éxito

- Un bot que haga POST a `/api/auth/register` sin token reCAPTCHA recibe 400
- Un mensaje con `<script>` en nombre al registrarse se guarda en DB como texto vacío, no como tag
- Un mensaje al chat con "ignora tus instrucciones" recibe 400 y aparece en `/admin/seguridad`
- Usuarios legítimos no notan ningún cambio en la experiencia
- Si Redis está caído, la capa 1 y 2 siguen funcionando; la capa 3 falla cerrado (rechaza el mensaje)

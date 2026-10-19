# Academia Comunidad Imparable

Plataforma digital de formación en desarrollo personal. By Cintia Paolucci & Alejandra Cuello.

- **Landing**: https://comunidad-imparables.vercel.app
- **App**: https://comunidad-imparables.vercel.app/login

---

## Stack

| Componente | Tecnología | Hosting |
|-----------|-----------|---------|
| Frontend | Next.js 15 + Tailwind CSS 4 + Framer Motion | Vercel |
| Backend | Node.js + Fastify | Render |
| Base de datos | PostgreSQL vía Supabase | Supabase |
| ORM | Prisma | — |
| Cache / Blacklist JWT | Redis | Render Redis |
| Emails | Gmail / Nodemailer | — |
| Pagos | MercadoPago | — |

---

## Setup Local

### Requisitos
- Node.js 20+
- Docker + Docker Compose

### 1. Clonar y configurar variables

```bash
git clone <repo>
cd Comunidad-Imparable

cp backend/.env.example backend/.env
# Editar backend/.env con tus claves

cp frontend/.env.local.example frontend/.env.local
```

### 2. Iniciar con Docker

```bash
docker compose up -d
```

### 3. Configurar base de datos

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Modo desarrollo

```bash
# Backend (http://localhost:3001)
cd backend && npm run dev

# Frontend (http://localhost:3000)
cd frontend && npm run dev
```

---

## Estructura

```
Comunidad-Imparable/
├── backend/
│   ├── src/
│   │   ├── routes/        # Auth, pagos, IA, admin
│   │   ├── services/      # iaRouter, email, ranking, certificates
│   │   ├── plugins/       # Fastify plugins (auth, multipart)
│   │   ├── middleware/    # Auth JWT + tenant
│   │   └── cron/          # Jobs automáticos
│   └── prisma/            # Schema + migrations + seed
└── frontend/
    └── src/
        ├── app/           # App Router (dashboard, admin, landing)
        ├── components/    # UI reutilizable
        ├── hooks/         # Custom hooks
        ├── lib/           # API client, utils
        ├── store/         # Zustand
        └── types/         # TypeScript
```

---

## API — Endpoints principales

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrarse |
| POST | /api/auth/logout | Cerrar sesión |
| POST | /api/auth/refresh | Refrescar token |
| GET | /api/auth/me | Usuario actual |
| POST | /api/auth/forgot-password | Recuperar contraseña |

### Pagos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/payments/vip/create | Iniciar pago VIP (USD 20) |
| POST | /api/payments/renewal/create | Iniciar renovación (USD 20/mes) |
| POST | /api/payments/webhook | Webhook MercadoPago |

### IA Consultiva
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/ia/agents | Listar agentes del cliente |
| POST | /api/ia/agents/:id/chat | Chat con IA Consultiva |
| GET | /api/ia/agents/:id/metrics | Métricas del usuario |

### Admin
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/admin/users | Listar alumnos |
| POST | /api/admin/users/:id/activate | Activar plan (30d o vitalicio) |
| GET | /api/admin/ranking | Ranking de alumnos |
| GET | /api/admin/metricas | Métricas globales |

---

## Variables de entorno (Backend)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secreto JWT (mín. 32 chars) |
| `JWT_REFRESH_SECRET` | Secreto refresh token |
| `ENCRYPTION_KEY` | Clave AES-256 (exactamente 32 chars) |
| `GROQ_API_KEY` | Groq (IA principal) |
| `ANTHROPIC_API_KEY` | Claude (fallback IA) |
| `OPENAI_API_KEY` | OpenAI (fallback IA) |
| `MP_ACCESS_TOKEN` | MercadoPago access token |
| `MP_WEBHOOK_SECRET` | Secreto HMAC webhook MP |
| `GMAIL_USER` | Gmail sender |
| `GMAIL_APP_PASSWORD` | Gmail app password |
| `CORS_ORIGIN` | URL del frontend |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v2 |

---

## IA Consultiva — Pipeline

```
Groq → Gemini (backupApiKey del agente) → Claude (primaryApiKey del agente) → OpenAI → fallback local
```

- Modo: **tradicional** — carga todos los documentos como contexto plano (sin RAG)
- Groq recibe solo los primeros 5 chunks por límite de TPM
- Límites: STUDENT = 15 consultas/día; CLIENT/ADMIN = sin límite

---

## Roles

| Rol | Acceso |
|-----|--------|
| `STUDENT` | Dashboard + IA (15 consultas/día) |
| `CLIENT` | Sin límite diario, sin check suscripción |
| `ADMIN` | Todo + panel de administración |

---

## Cron Jobs

| Horario | Tarea |
|---------|-------|
| 00:00 diario | Recalcular ranking |
| 06:00 diario | Verificar suscripciones |
| 08:00 diario | Alertas de inactividad |
| 09:00 lunes | Reportes semanales |

---

## Despliegue producción

Push a `main` → Vercel (frontend) y Render (backend) despliegan automáticamente.

```bash
# Flujo Claude Code
git checkout main
git cherry-pick <hash>
git push origin main
```

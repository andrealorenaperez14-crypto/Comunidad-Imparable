# Escuela Digital Elite — MVP

Plataforma SaaS educativa multitenant con agentes IA duales para profesionales latinoamericanos.

## Stack Tecnológico

| Componente | Tecnología | Hosting |
|-----------|-----------|---------|
| Frontend | Next.js 15 + Tailwind CSS 4 + Framer Motion | Vercel (free) |
| Backend | Node.js + Fastify | Render (free) |
| Base de datos | PostgreSQL vía Supabase | Supabase (free 500MB) |
| ORM | Prisma | — |
| Cache | Redis | Render Redis (free) |
| Emails | Resend | Free tier |
| Monitoreo | Sentry | Free tier |

**Costo total: $0/mes**

---

## Setup Local

### Requisitos
- Node.js 20+
- Docker + Docker Compose
- Git

### 1. Clonar y configurar variables

```bash
git clone <tu-repo>
cd MiNuevoProyecto

# Backend
cp backend/.env.example backend/.env
# Editar backend/.env con tus claves

# Frontend
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

### 4. Iniciar en modo desarrollo

**Backend:**
```bash
cd backend
npm run dev
# Disponible en http://localhost:3001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Disponible en http://localhost:3000
```

---

## Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@escueladigital.com | Admin123! |
| Estudiante | maria@ejemplo.com | Student123! |

---

## Estructura del Proyecto

```
MiNuevoProyecto/
├── backend/               # API Fastify
│   ├── src/
│   │   ├── routes/        # Endpoints REST
│   │   ├── services/      # Lógica de negocio
│   │   ├── plugins/       # Plugins Fastify
│   │   ├── middleware/    # Auth + Tenant
│   │   ├── utils/         # Encriptación, validadores
│   │   └── cron/          # Jobs automáticos
│   └── prisma/            # Schema + Migrations + Seed
├── frontend/              # Next.js 15
│   └── src/
│       ├── app/           # App Router pages
│       ├── components/    # Componentes reutilizables
│       ├── hooks/         # Custom hooks
│       ├── lib/           # API client, utils
│       ├── store/         # Zustand state
│       └── types/         # TypeScript types
├── .github/workflows/     # CI/CD
└── docker-compose.yml     # Dev local
```

---

## API Endpoints

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrarse |
| POST | /api/auth/logout | Cerrar sesión |
| POST | /api/auth/refresh | Refrescar token |
| GET | /api/auth/me | Usuario actual |

### Suscripciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/subscription/status | Estado actual |
| POST | /api/subscription/upgrade | Actualizar plan |
| POST | /api/subscription/cancel | Cancelar |
| GET | /api/subscription/history | Historial |

### Agentes IA (Estudiante)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/agents/:id/chat | Chat con agente |
| GET | /api/agents/:id/metrics | Métricas personales |
| GET | /api/agents/:id/reports | Reportes |

### Admin Agentes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/admin/agents | Listar agentes |
| POST | /api/admin/agents | Crear agente |
| PUT | /api/admin/agents/:id | Actualizar |
| POST | /api/admin/agents/:id/knowledge | Subir base conocimiento |
| GET | /api/admin/agents/:id/interactions | Ver interacciones |
| POST | /api/admin/agents/:id/publish | Publicar/despublicar |

---

## Despliegue Producción

### Backend → Render

1. Conectar repositorio GitHub en [render.com](https://render.com)
2. Usar configuración de `backend/render.yaml`
3. Configurar variables de entorno secretas
4. Deploy automático en cada push a `main`

### Frontend → Vercel

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Configurar `NEXT_PUBLIC_API_URL` con la URL del backend
4. Deploy automático en cada push a `main`

### Base de datos → Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Copiar connection string
3. Configurar `DATABASE_URL` en Render

---

## Variables de Entorno Requeridas (Backend)

| Variable | Descripción |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| REDIS_URL | Redis connection string |
| JWT_SECRET | Secreto JWT (mín. 32 chars) |
| JWT_REFRESH_SECRET | Secreto refresh token |
| RESEND_API_KEY | Clave API de Resend |
| ENCRYPTION_KEY | Clave AES-256 (exactamente 32 chars) |
| GEMINI_API_KEY | Google Gemini API key |
| ANTHROPIC_API_KEY | Anthropic Claude API key |
| OPENAI_API_KEY | OpenAI API key (fallback) |
| CORS_ORIGIN | URL del frontend |

---

## Testing

```bash
cd backend
npm test              # Ejecutar tests
npm run test:coverage # Con cobertura
```

---

## Cron Jobs Automáticos

| Horario | Tarea |
|---------|-------|
| 00:00 diario | Recalcular ranking top 10 |
| 06:00 diario | Verificar suscripciones y enviar alertas |
| 08:00 diario | Alertas de inactividad (3 días sin login) |
| 22:00 diario | Alertas de rendimiento alto/bajo |
| 09:00 lunes | Reportes semanales a estudiantes |

---

## Arquitectura Multitenant

- Cada cliente (escuela) tiene su propio `clientId`
- Todos los modelos filtran por `clientId`
- Agentes IA configurados por cliente
- Branding y settings personalizables por cliente
- Agregar nuevo cliente: 30-60 minutos

---

**Go-live: 17/5/2026** 🚀

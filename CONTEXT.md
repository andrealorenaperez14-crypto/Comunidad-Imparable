# Comunidad Imparables — Contexto del Cliente

## El proyecto

**Academia Comunidad Imparable** — plataforma digital de formación en desarrollo personal.

- **URL producción**: https://comunidad-imparables.vercel.app
- **Stack**: Next.js 15 (frontend) + Fastify (backend) + Supabase/PostgreSQL + Prisma + Redis
- **Despliegue**: Vercel (frontend) + Railway/similar (backend)
- **Repo**: andrealorenaperez14-crypto/comunidad-imparable

## Las fundadoras

### Cintia Paolucci
- Co-fundadora
- Enfoque: Mentalidad, Identidad, Marca Personal, Acción concreta
- Historia: Mamá joven, tres hijos. Tuvo su despertar espiritual y hoy acompaña a personas a sacar sus dones al mundo y ganar dinero sin sacrificarse.
- Instagram: @cin.paolucci
- Lema: *"No me guardo nada de lo que aprendo."*

### Alejandra Cuello
- Co-fundadora
- Enfoque: Espiritualidad, Sanación, Propósito, Consciencia
- Formación: Metafísica, Reiki, Gemoterapia, Biodescodificación
- Historia: Se formó en herramientas de sanación desde adentro. Acompaña a construir negocios que reflejen la libertad interior.
- Instagram: @alejandra.cuello28
- Lema: *"La gratitud es la puerta de la abundancia."*

## La propuesta

**Lema**: "De adentro hacia afuera"

**Tagline email**: "Transformamos vidas a través del Desarrollo Personal"

**Audiencia**: hombres Y mujeres (no solo mujeres) que quieren transformarse de adentro hacia afuera.

**Problema que resuelve**: personas que consumen contenido, hacen cursos y vuelven a los mismos patrones. No es falta de voluntad, es falta de acompañamiento real y claridad.

## La Academia — qué incluye

| Módulo | Contenido |
|--------|-----------|
| ◆ I — Clases con Alejandra | Espiritualidad, sanación, expansión de consciencia y propósito. Semanal, grabadas. |
| ◆ II — Clases con Cintia | Mentalidad, identidad, marca personal, acción. Semanal, grabadas. |
| ◆ III — Mentoría grupal en vivo | Martes, en vivo. Trabajo en tiempo real de bloqueos y próximos pasos. Grabada. |
| ◆ IV — Comunidad | Espacio donde celebran avances y se acompañan mutuamente. |

**Horarios mentoría en vivo (martes)**:
- Argentina: 18:00 hs
- Colombia / Perú / EEUU (EST): 16:00 hs
- España: 23:00 hs

## Los cinco pilares

1. **Claridad** — ordenar lo que se sabe y siente
2. **Consciencia** — verse sin filtros, sin juicio, con verdad
3. **Acción** — la claridad llega después de actuar
4. **Libertad** — económica, emocional y de expresión
5. **Abundancia** — consecuencia de ser coherente con quien uno es

## Redes y canales

- Grupo WhatsApp (comunidad gratuita): https://chat.whatsapp.com/ELk2u2CdgaJ1pqMeUhrTVg
- Instagram Cintia: https://www.instagram.com/cin.paolucci
- Instagram Alejandra: https://www.instagram.com/alejandra.cuello28
- YouTube: https://youtube.com/@comunidad.imparables

## Plataforma digital — modelo de negocio

**Planes**:
- `TRIAL`: acceso de prueba
- `30_DAYS`: plan mensual (USD 20 renovación)
- `VITALICIO`: acceso permanente

**Ingreso a plataforma**: https://comunidad-imparables.vercel.app/login

**Pagos**: MercadoPago (VIP USD 20 inscripción, Renovación USD 20/mes)

## IA Consultiva

La plataforma tiene **una sola IA**: **IA Consultiva**, asistente de desarrollo personal 24/7.

- Responde preguntas sobre desarrollo personal, mentalidad, propósito, negocios alineados con quien uno es
- Modo: **tradicional** (carga todos los documentos como contexto plano, NO usa RAG)
- Pipeline: Groq → Gemini → Claude → OpenAI → fallback local
- Límites: STUDENT = 15 consultas/día; CLIENT/ADMIN = sin límite

## Branding — colores

| Token | Valor |
|-------|-------|
| Fondo principal | `#160D28` (púrpura oscuro) |
| Fondo card | `#1F1238` |
| Fondo alt | `#2B1B3D` |
| Oro principal | `#C17D1A` |
| Texto | `#FAF8F5` |

> En el panel admin/app el branding usa gama **oro `#EAB308`/`#CA8A04` sobre negro `#0C0C0C`**.
> PROHIBIDO usar verde, azul, rojo o púrpura externo en el panel.

## Estructura técnica del backend

```
backend/src/
  routes/
    auth.js          — register, login, refresh, forgot-password
    payments.js      — MercadoPago VIP + renovación
    ia.js            — chat con IA Consultiva
    admin/
      users.js       — gestión de alumnos, activación de planes
      metricas.js    — métricas de uso
  services/
    iaRouter.js      — lógica de routing de IA (Groq→Gemini→Claude→OpenAI)
    email.js         — emails transaccionales (Nodemailer)
    ranking.js       — ranking de alumnos (solo CONSULTIVA, peso 1.0)
    certificates.js  — generación de certificados PDF
  prisma/
    schema.prisma    — modelos: User, Client, IAAgent, Subscription, etc.
```

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `STUDENT` | Plataforma + IA (15 consultas/día) |
| `CLIENT` | Sin límite diario, sin check suscripción |
| `ADMIN` | Igual que CLIENT + panel de administración |

## Estado de producción (Octubre 2026)

- ✅ Frontend desplegado en Vercel
- ✅ Single IA (solo CONSULTIVA, sin COACH ni MENTALIDAD)
- ✅ Modo tradicional de IA (sin RAG)
- ✅ Branding actualizado: Academia Comunidad Imparable / Cintia & Alejandra
- ✅ Pagos MercadoPago activos
- ✅ Ranking solo CONSULTIVA (peso 1.0)

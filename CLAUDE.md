
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

## Branding — colores (REGLA ABSOLUTA)
Todo elemento visual que se agregue al frontend SIEMPRE debe usar la gama del branding:
- **Primario**: oro `#EAB308` / `#CA8A04` / `rgba(196,151,42,...)` / `var(--color-gold)`
- **Fondos**: negro `#0C0C0C` / `rgba(20,20,20,...)` / `var(--color-bg)` / `var(--color-bg-card)`
- **Texto**: `var(--color-text)` / `var(--color-text-muted)`
- **Bordes**: `var(--color-gold-border)` / `rgba(196,151,42,0.2)`
- **PROHIBIDO** agregar colores externos: verde, azul, rojo, púrpura, o cualquier color que no sea de la gama oro/negro/blanco. Sin excepciones.

## Skills Activos
- consejero: análisis adversarial. Activar con: `Usar skill consejero para [consulta]`

## Patrones críticos — lecciones aprendidas

### Fetch autenticado (NO usar axios/api para pagos)
Los endpoints de pago usan `fetch` nativo. El token vive en `localStorage`, NO en cookies.
Siempre incluir:
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
- Renovación: 10 req / 1 min (usuarios legítimos pueden reintentar rápido)
- Chat IA: 30 req / 1 min por usuario

### Roles y acceso a IAs
- `STUDENT`: acceso normal con límite 15 consultas/día por IA
- `CLIENT`: sin límite diario, sin check de suscripción — si `clientId` es null en JWT, el backend hace fallback al primer `Client` de la DB
- `ADMIN`: igual que CLIENT

### Renovación 20 USD — flujo completo
1. Usuario con plan vencido entra → dashboard layout detecta `isExpired` → muestra `ExpiredPage`
2. `ExpiredPage` muestra botón "Renovar 20 USD" solo si `isPaidExpired` (`isExpired && !isTrial`)
3. Dashboard activo (plan 30_DAYS no vencido) muestra botón "Renovar ahora" para acumular días
4. Backend `/renewal/create` valida historial VIP (`subscription.planType = '30_DAYS'` o DNI en `Registro`)
5. Webhook detecta `ref.type === 'renewal'` → suma 30 días desde `activeUntil` vigente (intercalable)
6. Si el usuario estuvo meses sin entrar: login → dashboard → ExpiredPage → renueva normal

### Activación manual de plan (admin)
En `/admin/alumnos` hay dos botones por alumno:
- **30 días**: activa plan `30_DAYS` desde hoy (para pruebas, cortesías, pagos fuera de MP)
- **Vitalicio**: activa plan `VITALICIO` permanente

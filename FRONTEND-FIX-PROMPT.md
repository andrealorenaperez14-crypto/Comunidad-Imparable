# FRONTEND REDESIGN — ESCUELA DE ASESORES
## Instrucciones para Claude Code

**Estética:** luxury/refined — institución de élite. Negro profundo + dorado metálico. Sin ruido visual.

---

## 1. VARIABLES CSS GLOBALES (globals.css)
```css
:root {
  --color-bg:          #0C0C0C;
  --color-bg-card:     #141414;
  --color-gold:        #C4972A;
  --color-gold-light:  #D4A843;
  --color-gold-dark:   #8B6914;
  --color-gold-border: rgba(196,151,42,0.25);
  --color-text:        #F5F0E8;
  --color-text-muted:  #8A8A7A;
  --color-separator:   rgba(196,151,42,0.15);
}
```

## 2. TIPOGRAFÍA (layout.tsx)
```tsx
import { Cinzel, Great_Vibes, DM_Sans } from 'next/font/google'
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-display', weight: ['400','600','700'] })
const greatVibes = Great_Vibes({ subsets: ['latin'], variable: '--font-script', weight: ['400'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
// Aplicar en body: className={`${cinzel.variable} ${greatVibes.variable} ${dmSans.variable}`}
```

```css
/* En globals.css */
h1, h2, h3 { font-family: var(--font-display); letter-spacing: 0.08em; }
.font-script  { font-family: var(--font-script); }
body          { font-family: var(--font-body); line-height: 1.7; color: var(--color-text); background: var(--color-bg); }
```

## 3. LOGOS — REEMPLAZAR EN COMPONENTES
```
Header/Nav:     /assets/client1/LOGO_y_nombre_ESCUELA_DE_ASESORES.png (h-10 max, object-contain)
Favicon:        /assets/client1/LOGO_SOLO_ESCUELA_DE_ASESORES.png
Sección Paga:   /assets/client1/LOGO_NEUROVENTAS.png (h-16, centrado)
Certificados:   /assets/client1/LOGO_NEUROVENTAS.png
About/Fundadora: /assets/client1/YAMI_MANSILLA_MARCA_PERSONAL.png
Firma Yami:     /assets/client1/LOGO_2_YAMI_MANSILLA.png (usar con font-script)
```

## 4. TEXTOS — REEMPLAZAR
```
Nombre escuela:  "Escuela de Asesores"
Tagline:         "Rompe Todos los Esquemas"
Subtítulo:       "Formamos Líderes, No Vendedores. Transformamos Vidas, No Solo Negocios."
Sección paga:    "Neuroventas"
Fundadora:       "Yami Mansilla" (usar font-script Great Vibes donde sea firma/firma)
Rol fundadora:   "Visionaria · Empresaria · Capacitadora"
Frase:           "No sigo tendencias, las creo."
```

## 5. AGENTES IA — ACTUALIZAR NOMBRES Y COPY
```
Reemplazar nombres anteriores por:
- "IA Coach"       → acompaña tu aprendizaje 24/7
- "IA Mentalidad"  → trabaja tus bloqueos y miedos
- "IA Consultiva"  → te asiste en cada venta y cierre

Copy sección IAs:
Título: "Nunca estás solo/a"
Subtítulo: "La primera plataforma donde todo tu proceso — aprender, crecer y vender — es asistido por inteligencia artificial las 24 horas."
```

## 6. ANIMACIONES — CORREGIR OVERFLOW
```tsx
// En TODOS los section/contenedor padre:
<section className="overflow-hidden">

// Animaciones permitidas — solo Y, valores pequeños:
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}

// Stagger listas:
transition={{ delay: index * 0.1 }}

// Hover cards:
whileHover={{ y: -4 }}

// PROHIBIDO: translateX grandes, scale exagerado, rotaciones, cualquier x >10px
```

## 7. ESPACIADO
```
Secciones:     py-20 lg:py-32 mínimo
Entre bloques: gap-12 lg:gap-16
Cards:         p-8 mínimo
Line-height:   1.7 body, 1.3 headings
Letter-spacing: 0.08em headings (Cinzel ya lo requiere)
Separadores:   border-b border-[var(--color-separator)]
```

## 8. ELIMINAR EMOJIS
```
Remover TODOS los emojis de: botones, nav, features, módulos, badges, actividades.
Reemplazar con lucide-react (stroke-width 1.5, size 20) o nada.
Lucide permitidos: BookOpen, Award, BarChart2, User, ChevronRight, Check, ArrowRight, Play, Brain, Target, TrendingUp
```

## 9. COMPONENTES — ESTILO
```css
/* Botón primario */
.btn-primary {
  background: var(--color-gold);
  color: #0C0C0C;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  padding: 12px 32px;
  border-radius: 4px;
  font-weight: 600;
  transition: background 200ms ease;
}
.btn-primary:hover { background: var(--color-gold-light); }

/* Cards */
.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-gold-border);
  border-radius: 6px;
  padding: 32px;
}

/* Separador dorado */
.gold-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
  margin: 40px 0;
}
```

## 10. CHECKLIST VERIFICACIÓN
- [ ] overflow-hidden en todos los section
- [ ] Cero emojis en UI
- [ ] Fonts Cinzel + Great Vibes + DM Sans cargando
- [ ] Variables CSS en globals.css
- [ ] Logos correctos en cada lugar
- [ ] Nombres actualizados (Escuela de Asesores, Neuroventas, Yami Mansilla)
- [ ] 3 agentes IA con nombres y copy nuevos
- [ ] py-20 mínimo entre secciones
- [ ] Responsive: 375px / 768px / 1280px
- [ ] Hover states en botones y cards

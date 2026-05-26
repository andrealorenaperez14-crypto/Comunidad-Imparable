---
name: token-optimizer
description: >
  Optimiza el uso de tokens, comprime contexto y mantiene memoria estructurada entre sesiones.
  Usar SIEMPRE cuando el usuario mencione: ahorrar tokens, optimizar contexto, memoria de conversación,
  resumir historial, continuar donde quedamos, recordar lo hablado, contexto largo, sesión anterior,
  reducir costos de API, eficiencia de prompts, comprimir conversación, o cuando la conversación
  supere las 20 turnos. También activar si el usuario pide "skill de memoria", "que recuerdes",
  "no perder el hilo", o cualquier referencia a mantener estado entre conversaciones.
---

# Token Optimizer & Context Memory Skill

Herramienta para maximizar eficiencia de tokens y mantener memoria estructurada entre sesiones.

---

## 1. ESTADO DE SESIÓN (leer al inicio)

Al comenzar cualquier tarea, busca si el usuario tiene un bloque `<!-- SESSION_STATE -->` en su mensaje.
Si existe, cargarlo como contexto base. Si no existe, crear uno vacío.

```
<!-- SESSION_STATE
proyecto: [nombre]
objetivo_principal: [qué quiere lograr]
decisiones_clave: [lista compacta]
pendientes: [tareas abiertas]
preferencias: [estilo, formato, restricciones]
última_sesión: [resumen en 2 líneas]
-->
```

---

## 2. TÉCNICAS DE AHORRO DE TOKENS

### A. Compresión de Contexto
- **Resumir cada 10 turnos**: condensa el historial en un bloque `SESSION_STATE` actualizado
- **Eliminar redundancia**: no repetir información ya establecida
- **Referencias cortas**: usar etiquetas `[→ ver decisión #3]` en vez de repetir contexto
- **Formato compacto**: preferir listas sobre prosa cuando sea posible

### B. Prompts Eficientes
- Instruir al usuario a incluir solo lo necesario: contexto mínimo viable
- Evitar saludos largos, repeticiones, confirmaciones innecesarias
- Usar plantillas precomprimidas para tareas recurrentes (ver `references/plantillas.md`)

### C. Respuestas Optimizadas
- Calibrar longitud de respuesta al tipo de tarea:
  - Preguntas simples: 1-3 oraciones
  - Tareas técnicas: solo el código/resultado + 1 línea de explicación
  - Análisis: estructura compacta con bullets, sin relleno
- No incluir disclaimer, repetición de la pregunta, ni cierre floreado salvo que se pida

### D. Chunking Inteligente
- Dividir tareas largas en pasos atómicos
- Procesar un chunk a la vez, guardar resultado en SESSION_STATE
- No cargar archivos completos si solo se necesita una sección

---

## 3. MEMORIA ENTRE SESIONES

### Formato de Memoria Comprimida

Al final de cada sesión relevante, generar un bloque para que el usuario copie y guarde:

```
=== MEMORIA SESIÓN [fecha] ===
PROYECTO: [nombre corto]
CONTEXTO: [2-3 oraciones del estado actual]
DECISIONES: 
  - [decisión 1]
  - [decisión 2]
PRÓXIMOS PASOS:
  - [paso 1]
  - [paso 2]
ARCHIVOS/DATOS CLAVE: [referencias o snippets críticos]
PREFERENCIAS USUARIO: [estilo, idioma, restricciones detectadas]
=== FIN MEMORIA ===
```

### Instrucción al Usuario
Al detectar fin de sesión importante, decir:
> "Para continuar donde quedamos en la próxima sesión, copia este bloque y pégalo al inicio de tu próximo mensaje:"
> [bloque de memoria]

### Al Recibir Memoria
Si el usuario pega un bloque `=== MEMORIA SESIÓN ===`, parsearlo e inmediatamente:
1. Confirmar en 1 línea lo que se recuerda
2. Preguntar solo si hay ambigüedad crítica
3. Continuar sin fricción

---

## 4. ESTRATEGIAS POR TIPO DE TAREA

| Tarea | Estrategia |
|-------|-----------|
| Código largo | Mostrar solo funciones modificadas, no el archivo completo |
| Análisis de doc | Extraer fragmentos relevantes, no el documento entero |
| Iteración creativa | Mantener solo la versión más reciente + el delta |
| Investigación | Acumular hallazgos en SESSION_STATE, no repetirlos |
| Conversación larga | Resumir cada 10 turnos automáticamente |

---

## 5. MÉTRICAS DE EFICIENCIA

Cuando el usuario pida un reporte de eficiencia, estimar:
- **Tokens ahorrados**: comparar respuesta optimizada vs respuesta estándar
- **Compresión de contexto**: % de reducción al resumir historial
- **Densidad informativa**: info útil / tokens totales

---

## 6. FLUJO DE ACTIVACIÓN

```
Usuario menciona memoria/tokens/contexto largo
        ↓
¿Hay SESSION_STATE o MEMORIA en el mensaje?
   SÍ → Cargar y confirmar en 1 línea
   NO → Crear SESSION_STATE vacío
        ↓
Ejecutar tarea con respuesta optimizada
        ↓
¿Sesión importante o >10 turnos?
   SÍ → Generar bloque MEMORIA para copiar
   NO → Actualizar SESSION_STATE internamente
```

---

## 7. REFERENCIAS

- `references/plantillas.md` — Plantillas comprimidas para tareas frecuentes
- `references/guia-prompts.md` — Guía de prompts eficientes por caso de uso

# Guía de Prompts Eficientes

## Principios Generales

1. **Contexto mínimo viable**: incluir solo lo que Claude NO puede inferir
2. **Especificidad > longitud**: "corrige el bug en línea 42" > "por favor revisa mi código y dime si hay algún problema"
3. **Formato explícito**: pedir el formato de salida reduce iteraciones
4. **Una tarea por turno**: para tareas largas, dividir > agrupar

---

## Por Tipo de Tarea

### Código
❌ "Tengo un problema con mi código, no funciona bien, aquí te paso todo el proyecto..."
✅ "Bug en `función X`: recibe `[input]`, debería retornar `[Y]`, retorna `[Z]`. Código: [snippet]"

### Escritura
❌ "Escríbeme algo sobre IA para mi blog"
✅ "Post blog: IA en empresas. Audiencia: gerentes no técnicos. 300 palabras. Tono: práctico. Incluir: 1 caso real, 1 acción concreta."

### Análisis
❌ "¿Qué opinas de estos datos?" [tabla enorme]
✅ "Datos de ventas Q1-Q2. Pregunta: ¿por qué cayó marzo? Columnas relevantes: fecha, monto, canal. [tabla filtrada]"

### Decisiones
❌ "No sé qué hacer, tengo muchas opciones..."
✅ "Decisión: [A] vs [B]. Criterios: costo, tiempo, riesgo. Restricción: [X]. Dame pros/contras en tabla."

---

## Patrones de Ahorro por Situación

### Cuando el contexto es largo
- Resumir el historial relevante en 3-5 bullets antes de la pregunta
- Usar referencias: "siguiendo la arquitectura que definimos [ver MEMORIA]"

### Cuando hay iteración
- Solo enviar el delta: "cambiar X por Y, mantener el resto igual"
- No re-enviar el documento completo si solo cambia una parte

### Cuando hay archivos grandes
- Extraer y enviar solo la sección relevante
- Mencionar la estructura del archivo para contexto sin enviarlo todo

### Cuando se trabaja en un proyecto largo
- Mantener SESSION_STATE actualizado
- Al inicio de cada sesión: 1 línea de estado actual + tarea específica

---

## Señales de Prompt Ineficiente

- Repetir información ya dada en la misma sesión
- Incluir archivo completo cuando solo importa una función
- Pedir múltiples cosas no relacionadas en un turno
- No especificar formato de salida (genera re-iteraciones)
- Contexto "por si acaso" que no afecta la respuesta

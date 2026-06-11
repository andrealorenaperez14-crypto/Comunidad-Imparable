
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

## Skills Activos
- consejero: análisis adversarial. Activar con: `Usar skill consejero para [consulta]`

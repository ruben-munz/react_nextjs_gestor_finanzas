---
name: changelog-manager
description: Crea y actualiza el archivo changelog.md siguiendo el estándar Keep a Changelog. Úsala OBLIGATORIAMENTE al finalizar cualquier tarea que cree, modifique, refactorice o elimine código o configuración del proyecto.
---

# Changelog Manager

Registra cada cambio en `changelog.md` en la raíz del proyecto (creándolo si no existe).

## Flujo de Trabajo
Ejecuta el script al finalizar cualquier cambio de código:
```bash
node skills/changelog-manager/scripts/log-change.mjs --type "Added" --title "Resumen del cambio" --item "[Domain] Detalle del cambio"
```

---
name: clean-nextjs-scaffolder
description: Diseña y genera módulos siguiendo Clean Architecture en React y Next.js (App Router). Úsala SIEMPRE que el usuario pida crear una nueva feature, entidad, caso de uso, repositorio, Server Action o componente de UI dentro del proyecto.
---

# Clean Architecture Scaffolder (Next.js App Router)

Garantiza que cada módulo cumpla con Clean Architecture y la regla de dependencia definida en `agents.md`.

## Flujo de Trabajo
1. Si la feature no existe, ejecuta:
   `node skills/clean-nextjs-scaffolder/scripts/create-feature.mjs <nombre-feature>`
2. Consulta `references/dependency-rules.md` antes de importar entre capas.
3. Usa las plantillas de `assets/` (`Entity.template.ts`, `Repository.template.ts`, `UseCase.template.ts`).

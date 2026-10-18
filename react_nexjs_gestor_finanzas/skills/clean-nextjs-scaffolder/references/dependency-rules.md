# Reglas de Dependencia en Next.js (App Router)

1. `domain/`: TypeScript puro. Prohibido importar `react`, `next/*`, ORMs o librerías de UI.
2. `application/`: Orquesta entidades y puertos de `domain/`. Prohibido conocer Prisma, SQL o React.
3. `infrastructure/`: Implementa las interfaces de `domain/repositories/`.
4. `presentation/` y `src/app/`: Server Actions validan con `Zod`, invocan Casos de Uso y devuelven DTOs planos.

# Directrices del Agente de IA (`agents.md`)

## 1. Contexto del Proyecto y Rol
Eres un Arquitecto de Software y Desarrollador Senior Full-Stack especializado en **React, Next.js (App Router) y TypeScript**. Estamos construyendo un **Gestor de Finanzas**. 

Dado que se trata de una aplicación financiera, debes priorizar:
- **Integridad y precisión de los datos** (evitar errores de coma flotante en cálculos monetarios utilizando centavos en enteros o librerías de precisión decimal).
- **Mantenibilidad y escalabilidad** a largo plazo.
- **Seguridad y trazabilidad** en cada operación.

---

## 2. Reglas Inquebrantables de Desarrollo

Cada vez que generes código, propongas una solución o modifiques el proyecto, **ESTÁS OBLIGADO** a cumplir con los siguientes tres pilares:

### Pilar 1: Clean Architecture (Arquitectura Limpia)
Todo el código debe estructurarse siguiendo los principios de **Clean Architecture** y ** separación de responsabilidades (SoC)**. La regla de dependencia es estricta: **las dependencias solo apuntan hacia adentro (hacia el Dominio)**.

#### Estructura de Capas en Next.js (`src/`):

1. **Capa de Dominio (`src/core/domain/` o `src/features/[feature]/domain/`)**
   - **Contenido:** Entidades de negocio (ej. `Transaction`, `Account`, `Budget`), Value Objects (ej. `Money`, `Currency`), Interfaces de Repositorios (Puertos) y Errores de Dominio.
   - **Regla estricta:** Código TypeScript puro. **PROHIBIDO** importar React, Next.js, ORMs (Prisma/Drizzle) o librerías de UI en esta capa.

2. **Capa de Aplicación (`src/core/application/` o `src/features/[feature]/application/`)**
   - **Contenido:** Casos de Uso (Use Cases / Interactors), DTOs (Data Transfer Objects) y Contratos de Servicios.
   - **Regla estricta:** Orquesta la lógica llamando a las entidades y a las interfaces de los repositorios. No conoce detalles de la base de datos ni de la interfaz de usuario (React).

3. **Capa de Infraestructura (`src/core/infrastructure/` o `src/features/[feature]/infrastructure/`)**
   - **Contenido:** Implementaciones concretas de los repositorios (ej. `PrismaTransactionRepository`), clientes HTTP, adaptadores de servicios externos, configuración de base de datos y autenticación.
   - **Regla estricta:** Implementa las interfaces definidas en la capa de Dominio/Aplicación.

4. **Capa de Presentación / Framework (`src/app/` y `src/presentation/` o `src/components/`)**
   - **Contenido:** Rutas de Next.js (`app/`), Server Components, Client Components, Server Actions, Route Handlers, Custom Hooks y componentes de UI.
   - **Regla estricta:** Los componentes y Server Actions **no contienen lógica de negocio compleja**; su único trabajo es recibir datos del usuario, invocar el Caso de Uso correspondiente (vía inyección de dependencias) y devolver la respuesta a la vista.

---

### Pilar 2: Registro Obligatorio de Cambios (`changelog.md`)
Ninguna tarea está completa si no queda registrada.
- **Acción:** En cada iteración donde se cree, modifique, refactorice o elimine código, debes actualizar el archivo `changelog.md` en la raíz del proyecto.
- **Creación:** Si el archivo `changelog.md` no existe en la raíz del proyecto, **debes crearlo inmediatamente**.
- **Formato:** Basado en el estándar *Keep a Changelog*, ordenando los cambios del más reciente al más antiguo.

```markdown
# Changelog

## [YYYY-MM-DD] - Breve título del cambio o feature
### Added (Añadido)
- Descripción de nuevos archivos, casos de uso, entidades o componentes creados.

### Changed (Cambiado)
- Descripción de refactorizaciones o cambios en la lógica existente.

### Fixed (Corregido)
- Descripción de bugs solucionados.

### Removed (Eliminado)
- Código o dependencias eliminadas.
```

---

### Pilar 3: Documentación Técnica Incremental (`/docs`)
El proyecto debe mantener una documentación viva orientada a **desarrolladores**.
- **Ubicación:** Carpeta `/docs` en la raíz del proyecto (créala si no existe).
- **Naturaleza Incremental:** Cada vez que se haga una nueva propuesta, se diseñe un nuevo módulo o se modifique una funcionalidad existente, debes crear o actualizar los documentos correspondientes dentro de `/docs` sin borrar el contexto histórico relevante.
- **Tono y Audiencia:** Técnico, directo y pensado para otros desarrolladores que necesiten entender cómo funciona el sistema por dentro.
- **Estructura sugerida para `/docs`:**
  - `docs/01-architecture.md`: Visión general de la Clean Architecture aplicada al proyecto, flujo de dependencias y convenciones.
  - `docs/02-domain-model.md`: Diccionario de entidades financieras, reglas de negocio y relaciones (usar diagramas Mermaid cuando sea útil).
  - `docs/features/[nombre-feature].md`: Documentación específica de cada módulo (ej. `transactions.md`, `budgets.md`), detallando:
    - Propósito del módulo.
    - Casos de uso involucrados (Inputs/Outputs).
    - Decisiones técnicas tomadas.
    - Flujo de datos desde la UI (Next.js) hasta la persistencia.
  - `docs/adr/`: (Opcional) *Architecture Decision Records* para propuestas técnicas importantes.

---

## 3. Skills Disponibles en el Proyecto (`skills/`)

Tienes a tu disposición **5 skills especializadas** ubicadas en la carpeta `skills/`. Antes de abordar una tarea relacionada con cualquiera de ellas, **consulta su archivo `SKILL.md`, sus referencias (`references/`) y sus plantillas/scripts (`assets/` y `scripts/`)**:

1. **`clean-nextjs-scaffolder`** (`skills/clean-nextjs-scaffolder/SKILL.md`)
   - **Cuándo usarla:** SIEMPRE que se pida crear una nueva feature, entidad, caso de uso, repositorio, Server Action o componente de UI.
   - **Recursos clave:**
     - Script generador de estructura: `node skills/clean-nextjs-scaffolder/scripts/create-feature.mjs <nombre-feature>`
     - Reglas de dependencia: `skills/clean-nextjs-scaffolder/references/dependency-rules.md`
     - Plantillas base: `Entity.template.ts`, `Repository.template.ts`, `UseCase.template.ts` en `assets/`.

2. **`financial-domain-modeling`** (`skills/financial-domain-modeling/SKILL.md`)
   - **Cuándo usarla:** SIEMPRE que se escriba o modifique código que opere con dinero, divisas, porcentajes, impuestos, presupuestos, amortizaciones o balances.
   - **Recursos clave:**
     - Value Object monetario en céntimos (unidades menores enteras): `skills/financial-domain-modeling/assets/MoneyValueObject.ts`
     - Aritmética e invariantes contables: `references/money-arithmetic.md` y `references/ledger-invariants.md`.

3. **`changelog-manager`** (`skills/changelog-manager/SKILL.md`)
   - **Cuándo usarla:** OBLIGATORIAMENTE al finalizar cualquier tarea que cree, modifique, refactorice o elimine código o configuración del proyecto.
   - **Recursos clave:**
     - Script de registro automático: `node skills/changelog-manager/scripts/log-change.mjs --type "<Added|Changed|Fixed|Removed>" --title "<Resumen>" --item "<Detalle>"`
     - Plantilla base: `skills/changelog-manager/assets/changelog.template.md`.

4. **`incremental-dev-docs`** (`skills/incremental-dev-docs/SKILL.md`)
   - **Cuándo usarla:** SIEMPRE que se proponga una nueva funcionalidad, se modifique la arquitectura, se cambie el modelo de datos o se implemente un nuevo caso de uso.
   - **Recursos clave:**
     - Plantillas de documentación: `feature-spec.template.md` y `adr.template.md` en `skills/incremental-dev-docs/assets/`
     - Convenciones de diagramas Mermaid: `skills/incremental-dev-docs/references/mermaid-conventions.md`.

5. **`financial-unit-testing`** (`skills/financial-unit-testing/SKILL.md`)
   - **Cuándo usarla:** Cuando se creen o modifiquen entidades, Value Objects, calculadoras financieras o casos de uso en las capas `domain` y `application`.
   - **Recursos clave:**
     - Checklist de casos límite financieros: `skills/financial-unit-testing/references/edge-cases-checklist.md`
     - Plantilla de repositorio en memoria: `skills/financial-unit-testing/assets/InMemoryRepo.template.ts`.

---

## 4. Flujo de Trabajo del Agente (Checklist por Prompt)

Cada vez que el usuario te pida una nueva funcionalidad, propuesta o cambio, sigue este orden mental y de ejecución:

1. **Lectura de Contexto y Skills:** Revisa la documentación existente en `/docs` y carga las instrucciones (`SKILL.md`) de las skills aplicables en `skills/`.
2. **Diseño Arquitectónico (`clean-nextjs-scaffolder`):** Plantea la solución separando claramente qué va en `domain`, `application`, `infrastructure` y `presentation` (`app`). Usa `create-feature.mjs` si es un módulo nuevo.
3. **Implementación de Código (`financial-domain-modeling`):** Escribe el código respetando el tipado estricto en TypeScript (prohibido usar `any`) y operando importes monetarios en unidades menores enteras (`Money`).
4. **Testing Unitario (`financial-unit-testing`):** Cubre la lógica de dominio y casos de uso verificando los casos límite financieros.
5. **Actualización de `/docs` (`incremental-dev-docs`):** Documenta la nueva propuesta o actualiza el archivo correspondiente en `/docs` explicando la implementación para el equipo de desarrollo.
6. **Actualización de `changelog.md` (`changelog-manager`):** Registra todos los cambios realizados en el archivo `changelog.md` ejecutando `skills/changelog-manager/scripts/log-change.mjs`.

---

## 5. Buenas Prácticas Adicionales (React + Next.js + Finanzas)
- **Server First:** Aprovecha los React Server Components (RSC) por defecto; usa `'use client'` únicamente cuando sea necesaria la interactividad en el navegador (estados, efectos, eventos).
- **Validación de Datos:** Valida siempre las entradas en la frontera de la aplicación (Server Actions / API Routes) utilizando esquemas (ej. `Zod`) antes de pasarlas a los Casos de Uso.
- **Inyección de Dependencias:** Facilita el testing desacoplando la instanciación de los repositorios del código de los casos de uso.
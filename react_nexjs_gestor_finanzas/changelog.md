# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [Unreleased]
### Added
- **Infraestructura y Base de Datos (Docker + MySQL 8.0)**: `docker-compose.yml` con contenedor `react_nextjs_gestor_finanzas`, `.env` / `.env.example`, `database/init/01-schema.sql` (tablas `accounts`, `categories`, `transactions`, `investments` en céntimos enteros `BIGINT` y divisa `EUR`) y `database/init/02-seed.sql` + `scripts/seed.mjs` (`npm run db:seed`).
- **Capa de Dominio (`src/domain/`)**: Value Object inmutable `Money` en unidades menores enteras, entidades `Account`, `Category`, `Transaction`, `Investment`, errores de dominio y puertos (`IAccountRepository`, `ICategoryRepository`, `ITransactionRepository`, `IInvestmentRepository`).
- **Capa de Aplicación (`src/application/`)**: Casos de uso `GetFinancialDashboardUseCase`, `GetAccountsUseCase`, `GetCategoriesUseCase`, `GetTransactionsUseCase`, `CreateTransactionUseCase` y `GetInvestmentsUseCase` junto con sus DTOs serializables.
- **Capa de Infraestructura (`src/infrastructure/`)**: Pool de conexiones `mysql2/promise`, repositorios MySQL con soporte transaccional ACID, gestión de sesión por cookie (`gf_session_user`) y contenedor de inyección de dependencias (`makeFinancialContainer`).
- **Capa de Presentación (`src/presentation/` y `src/app/`)**: Pantalla `/login` con regla de Fake Login, `/logout`, `HeaderBar` con estado *"Conectado como: [Nombre de Usuario]"*, `KpiSummaryCards`, `FinancialChartsSection` (`recharts`), `AccountsSection`, `InvestmentsSection` y `TransactionsSection` con buscador, filtros y modal de creación en tiempo real.
- **Testing y Documentación (`/docs/`)**: Suite de tests unitarios con Vitest y documentación incremental en `docs/01-architecture.md`, `docs/02-domain-model.md`, `docs/features/financial-mvp.md` y `docs/adr/ADR-001-integer-cents-and-clean-architecture.md`.

<!-- CHANGELOG_ENTRIES_START -->

## [2026-10-18] - Implementación completa del MVP de Gestor de Finanzas Personales e Inversiones
### Added
- [Infrastructure] Creado docker-compose.yml (contenedor react_nextjs_gestor_finanzas con MySQL 8.0), .env, .env.example, esquema SQL (01-schema.sql) y seed de 6 meses (02-seed.sql + scripts/seed.mjs)
- [Domain] Implementado Value Object Money en céntimos enteros, entidades Account, Category, Transaction, Investment, errores de dominio y puertos de repositorios
- [Application] Implementados GetFinancialDashboardUseCase, GetAccountsUseCase, GetCategoriesUseCase, GetTransactionsUseCase, CreateTransactionUseCase y GetInvestmentsUseCase
- [Infrastructure] Implementados repositorios MySQL con mysql2/promise y transacciones ACID para actualización de saldos de cuentas
- [Presentation] Creado flujo Fake Login (/login, /logout, cookie de sesión), Header con badge de usuario conectado, KPI Cards, gráficos Recharts, vistas de cuentas, inversiones y gestor de movimientos con modal de creación
- [Testing & Docs] Añadida suite de tests unitarios con Vitest y documentación técnica incremental en /docs con diagramas Mermaid

## [2026-10-18] - Documentación de skills disponibles en AGENTS.md
### Changed
- [Docs] Añadida la sección de las 5 skills disponibles en skills/ y su integración en el flujo de trabajo dentro de AGENTS.md

## [2026-10-18] - Instalación de las 5 skills del proyecto
### Added
- [Config] Generadas las skills clean-nextjs-scaffolder, financial-domain-modeling, changelog-manager, incremental-dev-docs y financial-unit-testing en la carpeta skills/

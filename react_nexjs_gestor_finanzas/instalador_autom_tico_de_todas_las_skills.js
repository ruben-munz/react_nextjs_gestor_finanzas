#!/usr/bin/env node
/**
 * Script instalador de las 5 Skills para el Gestor de Finanzas (React + Next.js)
 * Formato oficial: Anthropic skill-creator (SKILL.md + scripts/ + references/ + assets/)
 *
 * Uso:
 *   node setup-skills.mjs
 *   node setup-skills.mjs --dir .agents/skills
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const dirFlagIndex = args.indexOf('--dir');
const baseSkillsDir = dirFlagIndex !== -1 && args[dirFlagIndex + 1]
  ? args[dirFlagIndex + 1]
  : '.claude/skills';

const filesToCreate = {
  // =========================================================================
  // 1. CLEAN-NEXTJS-SCAFFOLDER
  // =========================================================================
  [`${baseSkillsDir}/clean-nextjs-scaffolder/SKILL.md`]: `---
name: clean-nextjs-scaffolder
description: Diseña y genera módulos siguiendo Clean Architecture en React y Next.js (App Router). Úsala SIEMPRE que el usuario pida crear una nueva feature, entidad, caso de uso, repositorio, Server Action o componente de UI dentro del proyecto.
---

# Clean Architecture Scaffolder (Next.js App Router)

Garantiza que cada módulo cumpla con Clean Architecture y la regla de dependencia definida en \`agents.md\`.

## Flujo de Trabajo
1. Si la feature no existe, ejecuta:
   \`node ${baseSkillsDir}/clean-nextjs-scaffolder/scripts/create-feature.mjs <nombre-feature>\`
2. Consulta \`references/dependency-rules.md\` antes de importar entre capas.
3. Usa las plantillas de \`assets/\` (\`Entity.template.ts\`, \`Repository.template.ts\`, \`UseCase.template.ts\`).
`,

  [`${baseSkillsDir}/clean-nextjs-scaffolder/scripts/create-feature.mjs`]: `#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const featureName = process.argv[2];
if (!featureName) {
  console.error('Error: Indica el nombre de la feature. Ejemplo: node create-feature.mjs transactions');
  process.exit(1);
}

const baseDir = path.join(process.cwd(), 'src', 'features', featureName);
const dirs = [
  'domain/entities',
  'domain/value-objects',
  'domain/repositories',
  'domain/errors',
  'application/use-cases',
  'application/dtos',
  'infrastructure/repositories',
  'infrastructure/mappers',
  'presentation/actions',
  'presentation/components',
  'presentation/hooks',
];

for (const dir of dirs) {
  const fullPath = path.join(baseDir, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  const gitkeep = path.join(fullPath, '.gitkeep');
  if (!fs.existsSync(gitkeep)) {
    fs.writeFileSync(gitkeep, '');
  }
}

console.log(\`[clean-nextjs-scaffolder] Feature "\${featureName}" creada en src/features/\${featureName}\`);
`,

  [`${baseSkillsDir}/clean-nextjs-scaffolder/references/dependency-rules.md`]: `# Reglas de Dependencia en Next.js (App Router)

1. \`domain/\`: TypeScript puro. Prohibido importar \`react\`, \`next/*\`, ORMs o librerías de UI.
2. \`application/\`: Orquesta entidades y puertos de \`domain/\`. Prohibido conocer Prisma, SQL o React.
3. \`infrastructure/\`: Implementa las interfaces de \`domain/repositories/\`.
4. \`presentation/\` y \`src/app/\`: Server Actions validan con \`Zod\`, invocan Casos de Uso y devuelven DTOs planos.
`,

  [`${baseSkillsDir}/clean-nextjs-scaffolder/assets/Entity.template.ts`]: `export interface EntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseEntity<T extends EntityProps> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze({ ...props });
  }

  get id(): string {
    return this.props.id;
  }
}
`,

  [`${baseSkillsDir}/clean-nextjs-scaffolder/assets/Repository.template.ts`]: `export interface IRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  save(entity: TEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
`,

  [`${baseSkillsDir}/clean-nextjs-scaffolder/assets/UseCase.template.ts`]: `export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
`,

  // =========================================================================
  // 2. FINANCIAL-DOMAIN-MODELING
  // =========================================================================
  [`${baseSkillsDir}/financial-domain-modeling/SKILL.md`]: `---
name: financial-domain-modeling
description: Modela lógica financiera, cálculos monetarios, divisas, presupuestos, amortizaciones y balances. Úsala SIEMPRE que se escriba o modifique código que opere con dinero, porcentajes, impuestos, agregaciones de gastos/ingresos o entidades del dominio financiero.
---

# Financial Domain Modeling

Previene errores de coma flotante y protege las invariantes contables.

## Flujo de Trabajo
1. Prohibido operar dinero con decimales IEEE 754 directos. Usa \`assets/MoneyValueObject.ts\` trabajando en unidades menores enteras (céntimos).
2. Revisa \`references/money-arithmetic.md\` para conversiones ISO 4217 y reparto de céntimos (\`allocate\`).
3. Revisa \`references/ledger-invariants.md\` para transferencias entre cuentas, presupuestos y transacciones.
`,

  [`${baseSkillsDir}/financial-domain-modeling/references/money-arithmetic.md`]: `# Aritmética Monetaria Segura

- Almacena siempre los importes en unidades menores enteras (ej. 10,50 EUR = 1050 céntimos).
- Usa \`Money.allocate(ratios)\` para dividir importes en cuotas sin perder ni inventar céntimos.
- Nunca sumes ni restes instancias de \`Money\` de distinta divisa sin un tipo de cambio explícito.
`,

  [`${baseSkillsDir}/financial-domain-modeling/references/ledger-invariants.md`]: `# Invariantes Contables del Dominio

1. Toda transferencia entre dos cuentas debe generar dos movimientos simétricos enlazados cuya suma en la misma divisa sea 0.
2. Ninguna transacción puede tener importe igual a 0.
3. Todo presupuesto (Budget) debe tener un límite estrictamente mayor que 0.
`,

  [`${baseSkillsDir}/financial-domain-modeling/assets/MoneyValueObject.ts`]: `export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'MXN' | 'JPY';

const CURRENCY_DECIMALS: Record<CurrencyCode, number> = {
  EUR: 2,
  USD: 2,
  GBP: 2,
  MXN: 2,
  JPY: 0,
};

export class Money {
  private readonly amountInMinorUnits: number;
  public readonly currency: CurrencyCode;

  private constructor(amountInMinorUnits: number, currency: CurrencyCode) {
    if (!Number.isSafeInteger(amountInMinorUnits)) {
      throw new Error(\`El importe en unidades menores debe ser un entero seguro: \${amountInMinorUnits}\`);
    }
    this.amountInMinorUnits = amountInMinorUnits;
    this.currency = currency;
    Object.freeze(this);
  }

  public static fromMinorUnits(amountInMinorUnits: number, currency: CurrencyCode = 'EUR'): Money {
    return new Money(amountInMinorUnits, currency);
  }

  public static fromDecimal(amount: number, currency: CurrencyCode = 'EUR'): Money {
    const factor = Math.pow(10, CURRENCY_DECIMALS[currency]);
    return new Money(Math.round(amount * factor), currency);
  }

  public get minorUnits(): number {
    return this.amountInMinorUnits;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountInMinorUnits + other.amountInMinorUnits, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountInMinorUnits - other.amountInMinorUnits, this.currency);
  }

  public allocate(ratios: number[]): Money[] {
    const totalRatio = ratios.reduce((acc, r) => acc + r, 0);
    if (totalRatio <= 0) throw new Error('Ratios inválidos');

    let remainder = this.amountInMinorUnits;
    const shares = ratios.map((ratio) => {
      const share = Math.floor((this.amountInMinorUnits * ratio) / totalRatio);
      remainder -= share;
      return share;
    });

    for (let i = 0; i < remainder; i++) {
      shares[i] += 1;
    }

    return shares.map((s) => new Money(s, this.currency));
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(\`Divisas incompatibles: \${this.currency} vs \${other.currency}\`);
    }
  }
}
`,

  // =========================================================================
  // 3. CHANGELOG-MANAGER
  // =========================================================================
  [`${baseSkillsDir}/changelog-manager/SKILL.md`]: `---
name: changelog-manager
description: Crea y actualiza el archivo changelog.md siguiendo el estándar Keep a Changelog. Úsala OBLIGATORIAMENTE al finalizar cualquier tarea que cree, modifique, refactorice o elimine código o configuración del proyecto.
---

# Changelog Manager

Registra cada cambio en \`changelog.md\` en la raíz del proyecto (creándolo si no existe).

## Flujo de Trabajo
Ejecuta el script al finalizar cualquier cambio de código:
\`\`\`bash
node ${baseSkillsDir}/changelog-manager/scripts/log-change.mjs --type "Added" --title "Resumen del cambio" --item "[Domain] Detalle del cambio"
\`\`\`
`,

  [`${baseSkillsDir}/changelog-manager/assets/changelog.template.md`]: `# Changelog

Todos los cambios notables en este proyecto (Gestor de Finanzas) serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

<!-- CHANGELOG_ENTRIES_START -->
`,

  [`${baseSkillsDir}/changelog-manager/scripts/log-change.mjs`]: `#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
let type = 'Added';
let title = 'Actualización del proyecto';
const items = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--type' && args[i + 1]) type = args[++i];
  else if (args[i] === '--title' && args[i + 1]) title = args[++i];
  else if (args[i] === '--item' && args[i + 1]) items.push(args[++i]);
}

if (items.length === 0) {
  console.error('Uso: node log-change.mjs --type "Added" --title "Título" --item "[Domain] Cambio 1"');
  process.exit(1);
}

const changelogPath = path.join(process.cwd(), 'changelog.md');
const marker = '<!-- CHANGELOG_ENTRIES_START -->';

if (!fs.existsSync(changelogPath)) {
  const defaultHeader = \`# Changelog\\n\\nTodos los cambios notables en este proyecto serán documentados en este archivo.\\n\\n\${marker}\\n\`;
  fs.writeFileSync(changelogPath, defaultHeader, 'utf8');
}

const today = new Date().toISOString().split('T')[0];
const bulletList = items.map((item) => \`- \${item}\`).join('\\n');
const newEntry = \`\${marker}\\n\\n## [\${today}] - \${title}\\n### \${type}\\n\${bulletList}\`;

const currentContent = fs.readFileSync(changelogPath, 'utf8');
const updatedContent = currentContent.includes(marker)
  ? currentContent.replace(marker, newEntry)
  : \`\${currentContent}\\n\\n## [\${today}] - \${title}\\n### \${type}\\n\${bulletList}\\n\`;

fs.writeFileSync(changelogPath, updatedContent, 'utf8');
console.log(\`[changelog-manager] changelog.md actualizado con éxito (\${today} - \${title}).\`);
`,

  // =========================================================================
  // 4. INCREMENTAL-DEV-DOCS
  // =========================================================================
  [`${baseSkillsDir}/incremental-dev-docs/SKILL.md`]: `---
name: incremental-dev-docs
description: Genera y actualiza de forma incremental la documentación técnica para desarrolladores dentro de la carpeta /docs. Úsala SIEMPRE que se proponga una nueva funcionalidad, se modifique la arquitectura, se cambie el modelo de datos o se implemente un nuevo caso de uso.
---

# Incremental Developer Documentation (/docs)

Mantiene viva e incremental la documentación técnica en \`/docs\`.

## Flujo de Trabajo
1. Inspecciona los archivos existentes en \`/docs\` antes de editar para no borrar el contexto histórico.
2. Usa \`assets/feature-spec.template.md\` para documentar módulos en \`docs/features/<feature>.md\`.
3. Usa \`assets/adr.template.md\` para decisiones arquitectónicas en \`docs/adr/\`.
4. Incluye diagramas Mermaid siguiendo \`references/mermaid-conventions.md\`.
`,

  [`${baseSkillsDir}/incremental-dev-docs/references/mermaid-conventions.md`]: `# Convenciones Mermaid para /docs

Usa \`sequenceDiagram\` para mostrar el flujo \`UI -> Server Action -> UseCase -> Entity/VO -> Repository\` y \`classDiagram\` para el modelo de dominio financiero.
`,

  [`${baseSkillsDir}/incremental-dev-docs/assets/feature-spec.template.md`]: `# Feature: [Nombre del Módulo]

> **Estado:** Propuesto | En Desarrollo | Implementado
> **Última actualización:** YYYY-MM-DD

## 1. Propósito Técnico
## 2. Modelo de Dominio e Invariantes
## 3. Casos de Uso (Inputs / Outputs)
## 4. Diagrama de Secuencia (Mermaid)
## 5. Infraestructura y Persistencia
## 6. Historial Incremental de Cambios
`,

  [`${baseSkillsDir}/incremental-dev-docs/assets/adr.template.md`]: `# ADR-[Número]: [Título]

* **Estado:** Propuesto | Aceptado | Reemplazado
* **Fecha:** YYYY-MM-DD

## Contexto
## Opciones Consideradas
## Decisión
## Consecuencias
`,

  // =========================================================================
  // 5. FINANCIAL-UNIT-TESTING
  // =========================================================================
  [`${baseSkillsDir}/financial-unit-testing/SKILL.md`]: `---
name: financial-unit-testing
description: Crea tests unitarios y de integración para el dominio financiero y casos de uso desacoplados de Next.js. Úsala cuando se creen nuevas entidades, Value Objects, calculadoras financieras o casos de uso en las capas domain y application.
---

# Financial Unit Testing

Crea suites de tests rápidas y deterministas para \`domain\` y \`application\`.

## Flujo de Trabajo
1. Revisa \`references/edge-cases-checklist.md\` para cubrir redondeos, céntimos impares y divisas.
2. Usa \`assets/InMemoryRepo.template.ts\` para testear Casos de Uso sin acoplarlos a la base de datos.
`,

  [`${baseSkillsDir}/financial-unit-testing/references/edge-cases-checklist.md`]: `# Checklist de Casos Límite Financieros

1. Suma clásica $0.10 + 0.20 = 0.30$ (30 céntimos exactos).
2. Reparto de céntimos impares (ej. 100,00 EUR entre 3 = 3334, 3333 y 3333 céntimos).
3. Rechazo de operaciones entre divisas distintas sin tipo de cambio.
4. Rechazo de transacciones con importe 0 o presupuestos con límite <= 0.
5. Fechas de fin de mes (29 feb, 31 ene) en transacciones recurrentes.
`,

  [`${baseSkillsDir}/financial-unit-testing/assets/InMemoryRepo.template.ts`]: `export class InMemoryRepository<TEntity extends { id: string }> {
  public items = new Map<string, TEntity>();

  async findById(id: string): Promise<TEntity | null> {
    return this.items.get(id) ?? null;
  }

  async save(entity: TEntity): Promise<void> {
    this.items.set(entity.id, entity);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  clear(): void {
    this.items.clear();
  }
}
`,
};

for (const [relativePath, content] of Object.entries(filesToCreate)) {
  const fullPath = path.resolve(process.cwd(), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✔ Creado: ${relativePath}`);
}

console.log(`\n¡Instalación completada! Se han generado las 5 skills con sus scripts, referencias y plantillas en "${baseSkillsDir}".`);
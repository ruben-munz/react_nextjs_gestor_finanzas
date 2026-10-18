#!/usr/bin/env node
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

console.log(`[clean-nextjs-scaffolder] Feature "${featureName}" creada en src/features/${featureName}`);

#!/usr/bin/env node
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
  const defaultHeader = `# Changelog\n\nTodos los cambios notables en este proyecto serán documentados en este archivo.\n\n${marker}\n`;
  fs.writeFileSync(changelogPath, defaultHeader, 'utf8');
}

const today = new Date().toISOString().split('T')[0];
const bulletList = items.map((item) => `- ${item}`).join('\n');
const newEntry = `${marker}\n\n## [${today}] - ${title}\n### ${type}\n${bulletList}`;

const currentContent = fs.readFileSync(changelogPath, 'utf8');
const updatedContent = currentContent.includes(marker)
  ? currentContent.replace(marker, newEntry)
  : `${currentContent}\n\n## [${today}] - ${title}\n### ${type}\n${bulletList}\n`;

fs.writeFileSync(changelogPath, updatedContent, 'utf8');
console.log(`[changelog-manager] changelog.md actualizado con éxito (${today} - ${title}).`);

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const rawVal = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) {
      process.env[key] = rawVal;
    }
  }
}

async function runSeed() {
  loadEnvFile();

  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || 'finanzas_user';
  const password = process.env.DB_PASSWORD || 'finanzas_pass';
  const database = process.env.DB_NAME || 'gestor_finanzas';

  console.log(`[db:seed] Conectando a MySQL en ${host}:${port} (DB: ${database})...`);

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  try {
    const schemaPath = path.join(process.cwd(), 'database', 'init', '01-schema.sql');
    const seedPath = path.join(process.cwd(), 'database', 'init', '02-seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('[db:seed] Ejecutando esquema SQL (01-schema.sql)...');
    try {
      await connection.query(schemaSql);
    } catch (err) {
      // Ignorar si algún índice ya existe en re-ejecuciones
      if (err && err.code !== 'ER_DUP_KEYNAME') {
        throw err;
      }
    }

    // Asegurar columna account_number si la tabla accounts existía de una versión previa
    try {
      await connection.query(
        "ALTER TABLE accounts ADD COLUMN account_number VARCHAR(34) NOT NULL DEFAULT 'ES0000000000000000000000' AFTER bank"
      );
    } catch (err) {
      if (err && err.code !== 'ER_DUP_FIELDNAME') {
        throw err;
      }
    }

    console.log('[db:seed] Insertando datos semilla de los últimos 6 meses (02-seed.sql)...');
    await connection.query(seedSql);

    console.log('[db:seed] ¡Base de datos inicializada y poblada con éxito!');
  } finally {
    await connection.end();
  }
}

runSeed().catch((err) => {
  console.error('[db:seed] Error al poblar la base de datos:', err.message);
  process.exit(1);
});

import mysql, { Pool } from 'mysql2/promise';

declare global {
  var __mysqlPool: Pool | undefined;
}

export function getMySqlPool(): Pool {
  if (!global.__mysqlPool) {
    global.__mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'finanzas_user',
      password: process.env.DB_PASSWORD || 'finanzas_pass',
      database: process.env.DB_NAME || 'gestor_finanzas',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
    });
  }
  return global.__mysqlPool;
}

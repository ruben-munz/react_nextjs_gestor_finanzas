import { RowDataPacket } from 'mysql2/promise';
import { Account, AccountType } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { CurrencyCode, Money } from '../../domain/value-objects/Money';
import { getMySqlPool } from '../database/mysql-client';

interface AccountRow extends RowDataPacket {
  id: string;
  name: string;
  type: AccountType;
  bank: string;
  balance_cents: number | string;
  currency: CurrencyCode;
  color: string;
  icon: string;
  created_at: Date;
  updated_at: Date;
}

export class MySqlAccountRepository implements IAccountRepository {
  private mapRowToEntity(row: AccountRow): Account {
    return new Account({
      id: row.id,
      name: row.name,
      type: row.type,
      bank: row.bank,
      balance: Money.fromMinorUnits(Number(row.balance_cents), row.currency || 'EUR'),
      color: row.color,
      icon: row.icon,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  public async findAll(): Promise<Account[]> {
    const pool = getMySqlPool();
    const [rows] = await pool.query<AccountRow[]>(
      'SELECT id, name, type, bank, balance_cents, currency, color, icon, created_at, updated_at FROM accounts ORDER BY balance_cents DESC'
    );
    return rows.map((r) => this.mapRowToEntity(r));
  }

  public async findById(id: string): Promise<Account | null> {
    const pool = getMySqlPool();
    const [rows] = await pool.query<AccountRow[]>(
      'SELECT id, name, type, bank, balance_cents, currency, color, icon, created_at, updated_at FROM accounts WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) return null;
    return this.mapRowToEntity(rows[0]);
  }

  public async save(account: Account): Promise<void> {
    const pool = getMySqlPool();
    await pool.execute(
      `INSERT INTO accounts (id, name, type, bank, balance_cents, currency, color, icon)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         type = VALUES(type),
         bank = VALUES(bank),
         balance_cents = VALUES(balance_cents),
         color = VALUES(color),
         icon = VALUES(icon)`,
      [
        account.id,
        account.name,
        account.type,
        account.bank,
        account.balance.minorUnits,
        account.balance.currency,
        account.color,
        account.icon,
      ]
    );
  }
}

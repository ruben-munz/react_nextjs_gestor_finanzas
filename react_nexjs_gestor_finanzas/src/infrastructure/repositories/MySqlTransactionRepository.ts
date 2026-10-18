import { RowDataPacket } from 'mysql2/promise';
import { Account } from '../../domain/entities/Account';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/Transaction';
import { ITransactionRepository, TransactionFilters } from '../../domain/repositories/ITransactionRepository';
import { CurrencyCode, Money } from '../../domain/value-objects/Money';
import { getMySqlPool } from '../database/mysql-client';

interface TransactionJoinedRow extends RowDataPacket {
  id: string;
  account_id: string;
  category_id: string;
  type: TransactionType;
  amount_cents: number | string;
  currency: CurrencyCode;
  concept: string;
  transaction_date: Date | string;
  status: TransactionStatus;
  account_name: string;
  category_name: string;
  category_icon: string;
}

export class MySqlTransactionRepository implements ITransactionRepository {
  private mapRowToEntity(row: TransactionJoinedRow): Transaction {
    return new Transaction({
      id: row.id,
      accountId: row.account_id,
      categoryId: row.category_id,
      type: row.type,
      amount: Money.fromMinorUnits(Number(row.amount_cents), row.currency || 'EUR'),
      concept: row.concept,
      date: new Date(row.transaction_date),
      status: row.status,
      accountName: row.account_name,
      categoryName: row.category_name,
      categoryIcon: row.category_icon,
    });
  }

  public async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const pool = getMySqlPool();
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters?.accountId && filters.accountId !== 'ALL') {
      conditions.push('t.account_id = ?');
      params.push(filters.accountId);
    }

    if (filters?.type) {
      conditions.push('t.type = ?');
      params.push(filters.type);
    }

    if (filters?.search && filters.search.trim()) {
      conditions.push('(t.concept LIKE ? OR c.name LIKE ? OR a.name LIKE ?)');
      const term = `%${filters.search.trim()}%`;
      params.push(term, term, term);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitClause = filters?.limit ? `LIMIT ${Number(filters.limit)}` : '';

    const sql = `
      SELECT
        t.id,
        t.account_id,
        t.category_id,
        t.type,
        t.amount_cents,
        t.currency,
        t.concept,
        t.transaction_date,
        t.status,
        a.name AS account_name,
        c.name AS category_name,
        c.icon AS category_icon
      FROM transactions t
      INNER JOIN accounts a ON a.id = t.account_id
      INNER JOIN categories c ON c.id = t.category_id
      ${whereClause}
      ORDER BY t.transaction_date DESC, t.created_at DESC
      ${limitClause}
    `;

    const [rows] = await pool.query<TransactionJoinedRow[]>(sql, params);
    return rows.map((r) => this.mapRowToEntity(r));
  }

  public async findById(id: string): Promise<Transaction | null> {
    const pool = getMySqlPool();
    const [rows] = await pool.query<TransactionJoinedRow[]>(
      `SELECT
        t.id,
        t.account_id,
        t.category_id,
        t.type,
        t.amount_cents,
        t.currency,
        t.concept,
        t.transaction_date,
        t.status,
        a.name AS account_name,
        c.name AS category_name,
        c.icon AS category_icon
      FROM transactions t
      INNER JOIN accounts a ON a.id = t.account_id
      INNER JOIN categories c ON c.id = t.category_id
      WHERE t.id = ?
      LIMIT 1`,
      [id]
    );
    if (rows.length === 0) return null;
    return this.mapRowToEntity(rows[0]);
  }

  public async createWithAccountBalanceUpdate(transaction: Transaction, updatedAccount: Account): Promise<void> {
    const pool = getMySqlPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute(
        `INSERT INTO transactions (id, account_id, category_id, type, amount_cents, currency, concept, transaction_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.id,
          transaction.accountId,
          transaction.categoryId,
          transaction.type,
          transaction.amount.minorUnits,
          transaction.amount.currency,
          transaction.concept,
          transaction.date,
          transaction.status,
        ]
      );

      await connection.execute(
        `UPDATE accounts SET balance_cents = ? WHERE id = ?`,
        [updatedAccount.balance.minorUnits, updatedAccount.id]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

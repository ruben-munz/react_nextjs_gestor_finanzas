import { RowDataPacket } from 'mysql2/promise';
import { Investment, InvestmentAssetType } from '../../domain/entities/Investment';
import { IInvestmentRepository } from '../../domain/repositories/IInvestmentRepository';
import { CurrencyCode, Money } from '../../domain/value-objects/Money';
import { getMySqlPool } from '../database/mysql-client';

interface InvestmentRow extends RowDataPacket {
  id: string;
  name: string;
  ticker: string;
  type: InvestmentAssetType;
  quantity: number | string;
  invested_amount_cents: number | string;
  current_value_cents: number | string;
  currency: CurrencyCode;
  updated_at: Date | string;
}

export class MySqlInvestmentRepository implements IInvestmentRepository {
  private mapRowToEntity(row: InvestmentRow): Investment {
    return new Investment({
      id: row.id,
      name: row.name,
      ticker: row.ticker,
      type: row.type,
      quantity: Number(row.quantity),
      investedAmount: Money.fromMinorUnits(Number(row.invested_amount_cents), row.currency || 'EUR'),
      currentValue: Money.fromMinorUnits(Number(row.current_value_cents), row.currency || 'EUR'),
      updatedAt: new Date(row.updated_at),
    });
  }

  public async findAll(): Promise<Investment[]> {
    const pool = getMySqlPool();
    const [rows] = await pool.query<InvestmentRow[]>(
      'SELECT id, name, ticker, type, quantity, invested_amount_cents, current_value_cents, currency, updated_at FROM investments ORDER BY current_value_cents DESC'
    );
    return rows.map((r) => this.mapRowToEntity(r));
  }

  public async findById(id: string): Promise<Investment | null> {
    const pool = getMySqlPool();
    const [rows] = await pool.query<InvestmentRow[]>(
      'SELECT id, name, ticker, type, quantity, invested_amount_cents, current_value_cents, currency, updated_at FROM investments WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) return null;
    return this.mapRowToEntity(rows[0]);
  }
}

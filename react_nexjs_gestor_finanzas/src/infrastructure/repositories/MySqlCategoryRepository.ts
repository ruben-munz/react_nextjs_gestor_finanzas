import { RowDataPacket } from 'mysql2/promise';
import { Category, CategoryType } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { CurrencyCode, Money } from '../../domain/value-objects/Money';
import { getMySqlPool } from '../database/mysql-client';

interface CategoryRow extends RowDataPacket {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  monthly_budget_cents: number | string | null;
  currency: CurrencyCode;
}

export class MySqlCategoryRepository implements ICategoryRepository {
  private mapRowToEntity(row: CategoryRow): Category {
    return new Category({
      id: row.id,
      name: row.name,
      type: row.type,
      icon: row.icon,
      monthlyBudget:
        row.monthly_budget_cents !== null
          ? Money.fromMinorUnits(Number(row.monthly_budget_cents), row.currency || 'EUR')
          : null,
    });
  }

  public async findAll(): Promise<Category[]> {
    const pool = getMySqlPool();
    const [rows] = await pool.query<CategoryRow[]>(
      'SELECT id, name, type, icon, monthly_budget_cents, currency FROM categories ORDER BY type ASC, name ASC'
    );
    return rows.map((r) => this.mapRowToEntity(r));
  }

  public async findById(id: string): Promise<Category | null> {
    const pool = getMySqlPool();
    const [rows] = await pool.query<CategoryRow[]>(
      'SELECT id, name, type, icon, monthly_budget_cents, currency FROM categories WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) return null;
    return this.mapRowToEntity(rows[0]);
  }
}

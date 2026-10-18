import { describe, expect, it } from 'vitest';
import { Account } from '../../domain/entities/Account';
import { Category } from '../../domain/entities/Category';
import { Investment } from '../../domain/entities/Investment';
import { Transaction } from '../../domain/entities/Transaction';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { IInvestmentRepository } from '../../domain/repositories/IInvestmentRepository';
import { ITransactionRepository, TransactionFilters } from '../../domain/repositories/ITransactionRepository';
import { Money } from '../../domain/value-objects/Money';
import { CreateTransactionUseCase } from '../use-cases/CreateTransactionUseCase';
import { GetFinancialDashboardUseCase } from '../use-cases/GetFinancialDashboardUseCase';

class InMemoryAccountRepository implements IAccountRepository {
  public items = new Map<string, Account>();

  async findAll(): Promise<Account[]> {
    return Array.from(this.items.values());
  }

  async findById(id: string): Promise<Account | null> {
    return this.items.get(id) ?? null;
  }

  async save(account: Account): Promise<void> {
    this.items.set(account.id, account);
  }
}

class InMemoryCategoryRepository implements ICategoryRepository {
  public items = new Map<string, Category>();

  async findAll(): Promise<Category[]> {
    return Array.from(this.items.values());
  }

  async findById(id: string): Promise<Category | null> {
    return this.items.get(id) ?? null;
  }
}

class InMemoryTransactionRepository implements ITransactionRepository {
  public items = new Map<string, Transaction>();

  constructor(private readonly accountRepo: InMemoryAccountRepository) {}

  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    let list = Array.from(this.items.values());
    if (filters?.accountId) {
      list = list.filter((t) => t.accountId === filters.accountId);
    }
    if (filters?.type) {
      list = list.filter((t) => t.type === filters.type);
    }
    return list;
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.items.get(id) ?? null;
  }

  async createWithAccountBalanceUpdate(transaction: Transaction, updatedAccount: Account): Promise<void> {
    this.items.set(transaction.id, transaction);
    await this.accountRepo.save(updatedAccount);
  }
}

class InMemoryInvestmentRepository implements IInvestmentRepository {
  public items = new Map<string, Investment>();

  async findAll(): Promise<Investment[]> {
    return Array.from(this.items.values());
  }

  async findById(id: string): Promise<Investment | null> {
    return this.items.get(id) ?? null;
  }
}

describe('Application Use Cases (InMemory Repositories)', () => {
  it('CreateTransactionUseCase registra un gasto y actualiza el saldo de la cuenta en céntimos', async () => {
    const accountRepo = new InMemoryAccountRepository();
    const categoryRepo = new InMemoryCategoryRepository();
    const txRepo = new InMemoryTransactionRepository(accountRepo);

    await accountRepo.save(
      new Account({
        id: 'acc-1',
        name: 'Cuenta Nómina',
        type: 'CHECKING',
        bank: 'BBVA',
        balance: Money.fromMinorUnits(485050, 'EUR'),
        color: '#2563eb',
        icon: 'Landmark',
      })
    );

    categoryRepo.items.set(
      'cat-super',
      new Category({
        id: 'cat-super',
        name: 'Supermercado',
        type: 'EXPENSE',
        icon: 'ShoppingCart',
        monthlyBudget: Money.fromMinorUnits(40000, 'EUR'),
      })
    );

    const createTxUseCase = new CreateTransactionUseCase(txRepo, accountRepo, categoryRepo);
    const result = await createTxUseCase.execute({
      id: 'tx-test-01',
      accountId: 'acc-1',
      categoryId: 'cat-super',
      type: 'EXPENSE',
      amountCents: 5050,
      concept: 'Compra semanal supermercado',
      date: new Date('2026-01-31T12:00:00Z'), // Fecha fin de mes (31 ene)
    });

    expect(result.newBalanceCents).toBe(480000);
    const updatedAcc = await accountRepo.findById('acc-1');
    expect(updatedAcc?.balance.minorUnits).toBe(480000);
  });

  it('GetFinancialDashboardUseCase calcula Patrimonio Neto, Liquidez, Inversiones y Tasa de Ahorro', async () => {
    const accountRepo = new InMemoryAccountRepository();
    const txRepo = new InMemoryTransactionRepository(accountRepo);
    const invRepo = new InMemoryInvestmentRepository();

    await accountRepo.save(
      new Account({
        id: 'acc-1',
        name: 'Cuenta Nómina',
        type: 'CHECKING',
        bank: 'BBVA',
        balance: Money.fromMinorUnits(500000, 'EUR'), // 5.000,00 €
        color: '#2563eb',
        icon: 'Landmark',
      })
    );

    invRepo.items.set(
      'inv-1',
      new Investment({
        id: 'inv-1',
        name: 'ETF S&P 500',
        ticker: 'VUSA',
        type: 'ETF',
        quantity: 10,
        investedAmount: Money.fromMinorUnits(1000000, 'EUR'), // 10.000,00 €
        currentValue: Money.fromMinorUnits(1200000, 'EUR'), // 12.000,00 € (+20%)
        updatedAt: new Date('2026-10-18T10:00:00Z'),
      })
    );

    txRepo.items.set(
      'tx-inc',
      new Transaction({
        id: 'tx-inc',
        accountId: 'acc-1',
        categoryId: 'cat-nomina',
        type: 'INCOME',
        amount: Money.fromMinorUnits(300000, 'EUR'), // 3.000,00 €
        concept: 'Nómina Octubre',
        date: new Date('2026-10-01T09:00:00Z'),
        status: 'POSTED',
        categoryName: 'Nómina',
      })
    );

    txRepo.items.set(
      'tx-exp',
      new Transaction({
        id: 'tx-exp',
        accountId: 'acc-1',
        categoryId: 'cat-vivienda',
        type: 'EXPENSE',
        amount: Money.fromMinorUnits(120000, 'EUR'), // 1.200,00 €
        concept: 'Alquiler Octubre',
        date: new Date('2026-10-03T10:00:00Z'),
        status: 'POSTED',
        categoryName: 'Alquiler/Hipoteca',
      })
    );

    const dashboardUseCase = new GetFinancialDashboardUseCase(accountRepo, txRepo, invRepo);
    const dashboard = await dashboardUseCase.execute(new Date('2026-10-18T12:00:00Z'));

    expect(dashboard.totalLiquidityCents).toBe(500000);
    expect(dashboard.totalInvestmentsValueCents).toBe(1200000);
    expect(dashboard.netWorthCents).toBe(1700000); // 17.000,00 €
    expect(dashboard.totalInvestmentsRoiPercentage).toBe(20);
    expect(dashboard.currentMonthNetCents).toBe(180000); // 1.800,00 €
    expect(dashboard.currentMonthSavingsRate).toBe(60); // 60% de ahorro
  });
});

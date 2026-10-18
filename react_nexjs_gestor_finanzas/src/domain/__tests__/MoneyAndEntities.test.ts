import { describe, expect, it } from 'vitest';
import { Account } from '../entities/Account';
import { Category } from '../entities/Category';
import { Investment } from '../entities/Investment';
import { Transaction } from '../entities/Transaction';
import { InvalidBudgetLimitError, InvalidTransactionAmountError } from '../errors/DomainError';
import { Money } from '../value-objects/Money';

describe('Financial Domain Modeling - Money Value Object & Entities', () => {
  it('1. Suma clásica 0.10 + 0.20 = 0.30 (30 céntimos exactos sin error IEEE 754)', () => {
    const a = Money.fromDecimal(0.1, 'EUR');
    const b = Money.fromDecimal(0.2, 'EUR');
    const total = a.add(b);

    expect(total.minorUnits).toBe(30);
    expect(total.toDecimal()).toBe(0.3);
  });

  it('2. Reparto de céntimos impares: 100,00 EUR entre 3 = 3334, 3333 y 3333 céntimos', () => {
    const hundredEuros = Money.fromMinorUnits(10000, 'EUR');
    const parts = hundredEuros.allocate([1, 1, 1]);

    expect(parts.map((p) => p.minorUnits)).toEqual([3334, 3333, 3333]);
    const sum = parts.reduce((acc, p) => acc.add(p), Money.zero('EUR'));
    expect(sum.minorUnits).toBe(10000);
  });

  it('3. Rechazo de operaciones entre divisas distintas sin tipo de cambio', () => {
    const eur = Money.fromMinorUnits(1000, 'EUR');
    const usd = Money.fromMinorUnits(1000, 'USD');

    expect(() => eur.add(usd)).toThrow(/Divisas incompatibles/);
    expect(() => eur.subtract(usd)).toThrow(/Divisas incompatibles/);
  });

  it('4. Rechazo de transacciones con importe 0 o negativo e invariante de presupuesto <= 0', () => {
    expect(
      () =>
        new Transaction({
          id: 'tx-zero',
          accountId: 'acc-1',
          categoryId: 'cat-1',
          type: 'EXPENSE',
          amount: Money.fromMinorUnits(0, 'EUR'),
          concept: 'Importe cero inválido',
          date: new Date(),
          status: 'POSTED',
        })
    ).toThrow(InvalidTransactionAmountError);

    expect(
      () =>
        new Category({
          id: 'cat-invalid',
          name: 'Ocio',
          type: 'EXPENSE',
          icon: 'Film',
          monthlyBudget: Money.fromMinorUnits(0, 'EUR'),
        })
    ).toThrow(InvalidBudgetLimitError);
  });

  it('5. Cálculo exacto de rentabilidad y beneficio neto en Investment y saldos en Account', () => {
    const etf = new Investment({
      id: 'inv-1',
      name: 'Vanguard S&P 500',
      ticker: 'VUSA',
      type: 'ETF',
      quantity: 82.5,
      investedAmount: Money.fromMinorUnits(650000, 'EUR'),
      currentValue: Money.fromMinorUnits(784050, 'EUR'),
      updatedAt: new Date('2026-02-28T23:59:59Z'),
    });

    expect(etf.netProfit.minorUnits).toBe(134050);
    expect(etf.roiPercentage).toBe(20.62);

    const account = new Account({
      id: 'acc-1',
      name: 'Cuenta Nómina',
      type: 'CHECKING',
      bank: 'BBVA',
      balance: Money.fromMinorUnits(485050, 'EUR'),
      color: '#2563eb',
      icon: 'Landmark',
    });

    const afterExpense = account.debit(Money.fromMinorUnits(5050, 'EUR'));
    expect(afterExpense.balance.minorUnits).toBe(480000);
  });
});

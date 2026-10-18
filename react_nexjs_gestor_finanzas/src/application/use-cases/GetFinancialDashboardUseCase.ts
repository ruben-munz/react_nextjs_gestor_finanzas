import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { IInvestmentRepository } from '../../domain/repositories/IInvestmentRepository';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { Money } from '../../domain/value-objects/Money';
import {
  AssetAllocationItemDTO,
  CategoryExpenseShareDTO,
  FinancialDashboardDTO,
  MonthlyCashflowPointDTO,
} from '../dtos/financial.dtos';

const CATEGORY_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#06b6d4',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#6366f1',
];

const ASSET_TYPE_META: Record<string, { label: string; color: string }> = {
  LIQUIDITY: { label: 'Liquidez (Cuentas)', color: '#3b82f6' },
  ETF: { label: 'ETFs Indexados', color: '#10b981' },
  STOCK: { label: 'Acciones', color: '#6366f1' },
  BOND: { label: 'Bonos / Letras', color: '#f59e0b' },
  CRYPTO: { label: 'Criptomonedas', color: '#8b5cf6' },
  REAL_ESTATE: { label: 'Inmobiliario', color: '#ec4899' },
};

const MONTH_NAMES_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export class GetFinancialDashboardUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly investmentRepository: IInvestmentRepository
  ) {}

  public async execute(referenceDate: Date = new Date()): Promise<FinancialDashboardDTO> {
    const [accounts, transactions, investments] = await Promise.all([
      this.accountRepository.findAll(),
      this.transactionRepository.findAll(),
      this.investmentRepository.findAll(),
    ]);

    // 1. Liquidez Total en Cuentas (Money)
    const totalLiquidity = accounts.reduce(
      (sum, acc) => sum.add(acc.balance),
      Money.zero('EUR')
    );

    // 2. Valor Total y Coste de Inversiones (Money)
    const totalInvestmentsValue = investments.reduce(
      (sum, inv) => sum.add(inv.currentValue),
      Money.zero('EUR')
    );
    const totalInvestmentsCost = investments.reduce(
      (sum, inv) => sum.add(inv.investedAmount),
      Money.zero('EUR')
    );
    const totalInvestmentsProfit = totalInvestmentsValue.subtract(totalInvestmentsCost);
    const totalInvestmentsRoiPercentage =
      totalInvestmentsCost.minorUnits > 0
        ? Number(((totalInvestmentsProfit.minorUnits / totalInvestmentsCost.minorUnits) * 100).toFixed(2))
        : 0;

    // 3. Patrimonio Neto Total = Liquidez + Inversiones
    const netWorth = totalLiquidity.add(totalInvestmentsValue);

    // 4. Flujo de Caja del Mes Actual
    const currentYear = referenceDate.getFullYear();
    const currentMonth = referenceDate.getMonth();

    const postedTransactions = transactions.filter((tx) => tx.isPosted());

    let currentMonthIncome = Money.zero('EUR');
    let currentMonthExpense = Money.zero('EUR');

    for (const tx of postedTransactions) {
      if (tx.date.getFullYear() === currentYear && tx.date.getMonth() === currentMonth) {
        if (tx.type === 'INCOME') {
          currentMonthIncome = currentMonthIncome.add(tx.amount);
        } else if (tx.type === 'EXPENSE') {
          currentMonthExpense = currentMonthExpense.add(tx.amount);
        }
      }
    }

    const currentMonthNet = currentMonthIncome.subtract(currentMonthExpense);
    const currentMonthSavingsRate =
      currentMonthIncome.minorUnits > 0
        ? Number(((currentMonthNet.minorUnits / currentMonthIncome.minorUnits) * 100).toFixed(1))
        : 0;

    // 5. Evolución de Ingresos vs Gastos (Últimos 6 meses)
    const monthlyCashflow: MonthlyCashflowPointDTO[] = [];
    for (let offset = 5; offset >= 0; offset--) {
      const d = new Date(currentYear, currentMonth - offset, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;
      const monthLabel = `${MONTH_NAMES_SHORT[m]} ${String(y).slice(-2)}`;

      let mIncome = Money.zero('EUR');
      let mExpense = Money.zero('EUR');

      for (const tx of postedTransactions) {
        if (tx.date.getFullYear() === y && tx.date.getMonth() === m) {
          if (tx.type === 'INCOME') mIncome = mIncome.add(tx.amount);
          else if (tx.type === 'EXPENSE') mExpense = mExpense.add(tx.amount);
        }
      }

      const mNet = mIncome.subtract(mExpense);
      monthlyCashflow.push({
        monthKey,
        monthLabel,
        incomeCents: mIncome.minorUnits,
        incomeDecimal: mIncome.toDecimal(),
        expenseCents: mExpense.minorUnits,
        expenseDecimal: mExpense.toDecimal(),
        netCents: mNet.minorUnits,
        netDecimal: mNet.toDecimal(),
      });
    }

    // 6. Distribución de Gastos por Categoría (sobre los movimientos cargados)
    const categoryTotals = new Map<string, { name: string; amount: Money }>();
    let totalExpensesAll = Money.zero('EUR');

    for (const tx of postedTransactions) {
      if (tx.type === 'EXPENSE') {
        totalExpensesAll = totalExpensesAll.add(tx.amount);
        const existing = categoryTotals.get(tx.categoryId);
        if (existing) {
          categoryTotals.set(tx.categoryId, {
            name: existing.name,
            amount: existing.amount.add(tx.amount),
          });
        } else {
          categoryTotals.set(tx.categoryId, {
            name: tx.categoryName ?? 'Otros',
            amount: tx.amount,
          });
        }
      }
    }

    const expensesByCategory: CategoryExpenseShareDTO[] = Array.from(categoryTotals.entries())
      .sort((a, b) => b[1].amount.minorUnits - a[1].amount.minorUnits)
      .map(([categoryId, data], idx) => {
        const percentage =
          totalExpensesAll.minorUnits > 0
            ? Number(((data.amount.minorUnits / totalExpensesAll.minorUnits) * 100).toFixed(1))
            : 0;
        return {
          categoryId,
          categoryName: data.name,
          amountCents: data.amount.minorUnits,
          amountDecimal: data.amount.toDecimal(),
          amountFormatted: data.amount.format(),
          percentage,
          color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        };
      });

    // 7. Distribución del Patrimonio por Clase de Activo
    const assetTotals = new Map<string, Money>();
    if (totalLiquidity.minorUnits > 0) {
      assetTotals.set('LIQUIDITY', totalLiquidity);
    }
    for (const inv of investments) {
      const prev = assetTotals.get(inv.type) ?? Money.zero('EUR');
      assetTotals.set(inv.type, prev.add(inv.currentValue));
    }

    const assetAllocation: AssetAllocationItemDTO[] = Array.from(assetTotals.entries())
      .sort((a, b) => b[1].minorUnits - a[1].minorUnits)
      .map(([key, amount]) => {
        const meta = ASSET_TYPE_META[key] ?? { label: key, color: '#64748b' };
        const percentage =
          netWorth.minorUnits > 0
            ? Number(((amount.minorUnits / netWorth.minorUnits) * 100).toFixed(1))
            : 0;
        return {
          key,
          label: meta.label,
          amountCents: amount.minorUnits,
          amountDecimal: amount.toDecimal(),
          amountFormatted: amount.format(),
          percentage,
          color: meta.color,
        };
      });

    return {
      netWorthCents: netWorth.minorUnits,
      netWorthFormatted: netWorth.format(),
      totalLiquidityCents: totalLiquidity.minorUnits,
      totalLiquidityFormatted: totalLiquidity.format(),
      totalInvestmentsValueCents: totalInvestmentsValue.minorUnits,
      totalInvestmentsValueFormatted: totalInvestmentsValue.format(),
      totalInvestmentsCostCents: totalInvestmentsCost.minorUnits,
      totalInvestmentsCostFormatted: totalInvestmentsCost.format(),
      totalInvestmentsProfitCents: totalInvestmentsProfit.minorUnits,
      totalInvestmentsProfitFormatted: totalInvestmentsProfit.format(),
      totalInvestmentsRoiPercentage,
      currentMonthIncomeCents: currentMonthIncome.minorUnits,
      currentMonthIncomeFormatted: currentMonthIncome.format(),
      currentMonthExpenseCents: currentMonthExpense.minorUnits,
      currentMonthExpenseFormatted: currentMonthExpense.format(),
      currentMonthNetCents: currentMonthNet.minorUnits,
      currentMonthNetFormatted: currentMonthNet.format(),
      currentMonthSavingsRate,
      monthlyCashflow,
      expensesByCategory,
      assetAllocation,
    };
  }
}

import { AccountType } from '../../domain/entities/Account';
import { CategoryType } from '../../domain/entities/Category';
import { InvestmentAssetType } from '../../domain/entities/Investment';
import { TransactionStatus, TransactionType } from '../../domain/entities/Transaction';

export interface AccountDTO {
  id: string;
  name: string;
  type: AccountType;
  typeLabel: string;
  bank: string;
  balanceCents: number;
  balanceDecimal: number;
  balanceFormatted: string;
  currency: string;
  color: string;
  icon: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  monthlyBudgetCents: number | null;
  monthlyBudgetFormatted: string | null;
}

export interface TransactionDTO {
  id: string;
  accountId: string;
  accountName: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  type: TransactionType;
  amountCents: number;
  amountDecimal: number;
  amountFormatted: string;
  concept: string;
  dateIso: string;
  status: TransactionStatus;
}

export interface InvestmentDTO {
  id: string;
  name: string;
  ticker: string;
  type: InvestmentAssetType;
  typeLabel: string;
  quantity: number;
  investedCents: number;
  investedDecimal: number;
  investedFormatted: string;
  currentValueCents: number;
  currentValueDecimal: number;
  currentValueFormatted: string;
  netProfitCents: number;
  netProfitDecimal: number;
  netProfitFormatted: string;
  roiPercentage: number;
  updatedAtIso: string;
}

export interface MonthlyCashflowPointDTO {
  monthKey: string;
  monthLabel: string;
  incomeCents: number;
  incomeDecimal: number;
  expenseCents: number;
  expenseDecimal: number;
  netCents: number;
  netDecimal: number;
}

export interface CategoryExpenseShareDTO {
  categoryId: string;
  categoryName: string;
  amountCents: number;
  amountDecimal: number;
  amountFormatted: string;
  percentage: number;
  color: string;
}

export interface AssetAllocationItemDTO {
  key: string;
  label: string;
  amountCents: number;
  amountDecimal: number;
  amountFormatted: string;
  percentage: number;
  color: string;
}

export interface FinancialDashboardDTO {
  // KPI Cards
  netWorthCents: number;
  netWorthFormatted: string;
  totalLiquidityCents: number;
  totalLiquidityFormatted: string;
  totalInvestmentsValueCents: number;
  totalInvestmentsValueFormatted: string;
  totalInvestmentsCostCents: number;
  totalInvestmentsCostFormatted: string;
  totalInvestmentsProfitCents: number;
  totalInvestmentsProfitFormatted: string;
  totalInvestmentsRoiPercentage: number;
  currentMonthIncomeCents: number;
  currentMonthIncomeFormatted: string;
  currentMonthExpenseCents: number;
  currentMonthExpenseFormatted: string;
  currentMonthNetCents: number;
  currentMonthNetFormatted: string;
  currentMonthSavingsRate: number;

  // Datos para gráficos
  monthlyCashflow: MonthlyCashflowPointDTO[];
  expensesByCategory: CategoryExpenseShareDTO[];
  assetAllocation: AssetAllocationItemDTO[];
}

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  Landmark,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { FinancialDashboardDTO } from '../../application/dtos/financial.dtos';

interface KpiSummaryCardsProps {
  dashboard: FinancialDashboardDTO;
}

export function KpiSummaryCards({ dashboard }: KpiSummaryCardsProps) {
  const isPositiveInvestmentRoi = dashboard.totalInvestmentsProfitCents >= 0;
  const isPositiveMonthlyBalance = dashboard.currentMonthNetCents >= 0;

  return (
    <section id="resumen" className="scroll-mt-20">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            Posición Global Consolidada
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            ¿Cuánto dinero tengo hoy?
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Cálculos exactos en céntimos enteros (`Money` VO · ISO 4217 `EUR`)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* 1. Patrimonio Neto Total */}
        <article className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 p-5 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-300/90">
                Patrimonio Neto Total
              </p>
              <p className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {dashboard.netWorthFormatted}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-500/15 p-2.5 text-emerald-400">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-300">
            <span>Liquidez + Cartera</span>
            <span className="font-medium text-emerald-400">100% Consolidado</span>
          </div>
        </article>

        {/* 2. Liquidez Disponible en Cuentas */}
        <article className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Liquidez en Cuentas
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {dashboard.totalLiquidityFormatted}
              </p>
            </div>
            <div className="rounded-xl bg-blue-500/15 p-2.5 text-blue-400">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
            <span>Disponible inmediato</span>
            <span className="font-medium text-blue-400">
              {dashboard.netWorthCents > 0
                ? `${((dashboard.totalLiquidityCents / dashboard.netWorthCents) * 100).toFixed(1)}% del total`
                : '0%'}
            </span>
          </div>
        </article>

        {/* 3. Valor Total de Inversiones */}
        <article className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Valor Total de Inversiones
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {dashboard.totalInvestmentsValueFormatted}
              </p>
            </div>
            <div
              className={`rounded-xl p-2.5 ${
                isPositiveInvestmentRoi
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-rose-500/15 text-rose-400'
              }`}
            >
              {isPositiveInvestmentRoi ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
            <span className="text-slate-400">
              Coste: {dashboard.totalInvestmentsCostFormatted}
            </span>
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold ${
                isPositiveInvestmentRoi
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-rose-500/15 text-rose-400'
              }`}
            >
              {isPositiveInvestmentRoi ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {isPositiveInvestmentRoi ? '+' : ''}
              {dashboard.totalInvestmentsProfitFormatted} (
              {isPositiveInvestmentRoi ? '+' : ''}
              {dashboard.totalInvestmentsRoiPercentage}%)
            </span>
          </div>
        </article>

        {/* 4. Balance del Mes Actual */}
        <article className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Balance del Mes Actual
              </p>
              <p
                className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${
                  isPositiveMonthlyBalance ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPositiveMonthlyBalance ? '+' : ''}
                {dashboard.currentMonthNetFormatted}
              </p>
            </div>
            <div className="rounded-xl bg-purple-500/15 p-2.5 text-purple-400">
              <CalendarClock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">
                +{dashboard.currentMonthIncomeFormatted}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400">
                -{dashboard.currentMonthExpenseFormatted}
              </span>
            </div>
            <span className="rounded-full bg-purple-500/15 px-2 py-0.5 font-semibold text-purple-300">
              Ahorro: {dashboard.currentMonthSavingsRate}%
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}

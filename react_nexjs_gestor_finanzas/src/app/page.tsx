import { AlertTriangle, Database } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getSessionUsername } from '../infrastructure/auth/session';
import { makeFinancialContainer } from '../infrastructure/container';
import { AccountsSection } from '../presentation/components/AccountsSection';
import { FinancialChartsSection } from '../presentation/components/FinancialChartsSection';
import { HeaderBar } from '../presentation/components/HeaderBar';
import { InvestmentsSection } from '../presentation/components/InvestmentsSection';
import { KpiSummaryCards } from '../presentation/components/KpiSummaryCards';
import { TransactionsSection } from '../presentation/components/TransactionsSection';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const username = await getSessionUsername();
  if (!username) {
    redirect('/login');
  }

  const container = makeFinancialContainer();

  let dashboardData;
  let accountsData;
  let categoriesData;
  let investmentsData;
  let transactionsData;
  let dbError: string | null = null;

  try {
    [
      dashboardData,
      accountsData,
      categoriesData,
      investmentsData,
      transactionsData,
    ] = await Promise.all([
      container.getFinancialDashboardUseCase.execute(),
      container.getAccountsUseCase.execute(),
      container.getCategoriesUseCase.execute(),
      container.getInvestmentsUseCase.execute(),
      container.getTransactionsUseCase.execute(),
    ]);
  } catch (error) {
    dbError =
      error instanceof Error
        ? error.message
        : 'No se pudo conectar con el contenedor MySQL react_nextjs_gestor_finanzas.';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeaderBar username={username} />

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {dbError || !dashboardData || !accountsData || !categoriesData || !investmentsData || !transactionsData ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-200 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white">
                  Base de datos MySQL pendiente de conexión
                </h2>
                <p className="text-sm text-amber-200/90">
                  Asegúrate de que el contenedor Docker{' '}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-amber-300">
                    react_nextjs_gestor_finanzas
                  </code>{' '}
                  esté en ejecución y con los datos semilla cargados.
                </p>
                {dbError && (
                  <p className="rounded-xl bg-slate-950/80 p-3 font-mono text-xs text-rose-300">
                    Detalle: {dbError}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <span>
                    Ejecuta:{' '}
                    <code className="rounded bg-slate-900 px-2 py-0.5 font-mono text-emerald-300">
                      docker compose up -d && npm run db:seed
                    </code>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Resumen Superior ("Cuánto dinero tengo") */}
            <KpiSummaryCards dashboard={dashboardData} />

            {/* 2. Sección de Gráficos Interactivos */}
            <FinancialChartsSection
              monthlyCashflow={dashboardData.monthlyCashflow}
              expensesByCategory={dashboardData.expensesByCategory}
              assetAllocation={dashboardData.assetAllocation}
            />

            {/* 3. Mis Cuentas (Accounts) */}
            <AccountsSection accounts={accountsData} />

            {/* 4. Mis Inversiones (Investments) */}
            <InvestmentsSection investments={investmentsData} />

            {/* 5. Mis Movimientos (Transactions) + Formulario Nuevo Movimiento */}
            <TransactionsSection
              transactions={transactionsData}
              accounts={accountsData}
              categories={categoriesData}
            />
          </>
        )}
      </main>

      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        FinanzasPro MVP · Clean Architecture · Next.js App Router + TypeScript + MySQL 8.0 (`Money` Integer Cents)
      </footer>
    </div>
  );
}

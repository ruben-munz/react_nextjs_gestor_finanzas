import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Database } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getSessionUsername } from '../../infrastructure/auth/session';
import { makeFinancialContainer } from '../../infrastructure/container';
import { Footer } from '../../presentation/components/Footer';
import { HeaderBar } from '../../presentation/components/HeaderBar';
import { TransactionsSection } from '../../presentation/components/TransactionsSection';

export const dynamic = 'force-dynamic';

interface MovimientosPageProps {
  searchParams: Promise<{ accountId?: string }>;
}

export default async function MovimientosPage({ searchParams }: MovimientosPageProps) {
  const username = await getSessionUsername();
  if (!username) {
    redirect('/login');
  }

  const { accountId } = await searchParams;
  const container = makeFinancialContainer();

  let accountsData;
  let categoriesData;
  let transactionsData;
  let dbError: string | null = null;

  try {
    [accountsData, categoriesData, transactionsData] = await Promise.all([
      container.getAccountsUseCase.execute(),
      container.getCategoriesUseCase.execute(),
      container.getTransactionsUseCase.execute(),
    ]);
  } catch (error) {
    dbError =
      error instanceof Error
        ? error.message
        : 'No se pudo conectar con el contenedor MySQL react_nextjs_gestor_finanzas.';
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <HeaderBar username={username} />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-400" />
            Volver al Panel Principal
          </Link>
        </div>

        {dbError || !accountsData || !categoriesData || !transactionsData ? (
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
          <TransactionsSection
            transactions={transactionsData}
            accounts={accountsData}
            categories={categoriesData}
            initialAccountId={accountId}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

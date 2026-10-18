import { CreditCard, Landmark, PiggyBank, Wallet } from 'lucide-react';
import { AccountDTO } from '../../application/dtos/financial.dtos';

interface AccountsSectionProps {
  accounts: AccountDTO[];
}

function getAccountIcon(iconName: string) {
  switch (iconName) {
    case 'PiggyBank':
      return <PiggyBank className="h-5 w-5" />;
    case 'Wallet':
      return <Wallet className="h-5 w-5" />;
    case 'CreditCard':
      return <CreditCard className="h-5 w-5" />;
    default:
      return <Landmark className="h-5 w-5" />;
  }
}

export function AccountsSection({ accounts }: AccountsSectionProps) {
  return (
    <section id="cuentas" className="scroll-mt-20">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Mis Cuentas Bancarias y Efectivo
          </h2>
          <p className="text-xs text-slate-400">
            Saldos actualizados en tiempo real tras cada movimiento registrado
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
          {accounts.length} cuentas activas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-lg transition hover:border-slate-700"
          >
            {/* Barra de acento superior con el color de la cuenta */}
            <div
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ backgroundColor: acc.color }}
            />

            <div className="flex items-start justify-between pt-1">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ backgroundColor: acc.color }}
                >
                  {getAccountIcon(acc.icon)}
                </div>
                <div>
                  <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                    {acc.typeLabel}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-white">
                    {acc.name}
                  </h3>
                  <p className="text-xs text-slate-400">{acc.bank}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-baseline justify-between border-t border-slate-800/80 pt-4">
              <span className="text-xs uppercase tracking-wider text-slate-400">
                Saldo actual
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                {acc.balanceFormatted}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

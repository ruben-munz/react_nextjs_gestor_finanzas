import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Coins, Layers, Shield, TrendingUp } from 'lucide-react';
import { InvestmentDTO } from '../../application/dtos/financial.dtos';

interface InvestmentsSectionProps {
  investments: InvestmentDTO[];
}

function getAssetBadgeStyle(type: InvestmentDTO['type']) {
  switch (type) {
    case 'ETF':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    case 'STOCK':
      return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300';
    case 'CRYPTO':
      return 'border-purple-500/30 bg-purple-500/10 text-purple-300';
    case 'BOND':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
    default:
      return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
  }
}

function getAssetIcon(type: InvestmentDTO['type']) {
  switch (type) {
    case 'ETF':
      return <Layers className="h-4 w-4 text-emerald-400" />;
    case 'STOCK':
      return <BriefcaseBusiness className="h-4 w-4 text-indigo-400" />;
    case 'CRYPTO':
      return <Coins className="h-4 w-4 text-purple-400" />;
    case 'BOND':
      return <Shield className="h-4 w-4 text-amber-400" />;
    default:
      return <TrendingUp className="h-4 w-4 text-blue-400" />;
  }
}

export function InvestmentsSection({ investments }: InvestmentsSectionProps) {
  return (
    <section id="inversiones" className="scroll-mt-20">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Mi Cartera de Inversiones
          </h2>
          <p className="text-xs text-slate-400">
            Posiciones en ETFs indexados, acciones, criptoactivos y renta fija
          </p>
        </div>
        <span className="self-start rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 sm:self-auto">
          {investments.length} activos en cartera
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5 font-semibold">Activo / Ticker</th>
                <th className="px-4 py-3.5 font-semibold">Categoría</th>
                <th className="px-4 py-3.5 text-right font-semibold">Participaciones</th>
                <th className="px-4 py-3.5 text-right font-semibold">Coste Invertido</th>
                <th className="px-4 py-3.5 text-right font-semibold">Valor de Mercado</th>
                <th className="px-5 py-3.5 text-right font-semibold">Beneficio Neto (€ / %)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {investments.map((inv) => {
                const isProfit = inv.netProfitCents >= 0;
                return (
                  <tr
                    key={inv.id}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
                          {getAssetIcon(inv.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{inv.name}</div>
                          <div className="text-xs font-mono text-slate-400">
                            {inv.ticker}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getAssetBadgeStyle(
                          inv.type
                        )}`}
                      >
                        {inv.typeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-xs text-slate-300">
                      {inv.quantity.toLocaleString('es-ES', {
                        maximumFractionDigits: 4,
                      })}
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-slate-300">
                      {inv.investedFormatted}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-white">
                      {inv.currentValueFormatted}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex flex-col items-end">
                        <span
                          className={`inline-flex items-center gap-0.5 font-bold ${
                            isProfit ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isProfit ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          {isProfit ? '+' : ''}
                          {inv.netProfitFormatted}
                        </span>
                        <span
                          className={`mt-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                            isProfit
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-rose-500/15 text-rose-300'
                          }`}
                        >
                          {isProfit ? '+' : ''}
                          {inv.roiPercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

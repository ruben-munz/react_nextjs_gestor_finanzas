import Link from 'next/link';
import {
  Landmark,
  LineChart,
  LogOut,
  PieChart,
  ReceiptText,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { logoutAction } from '../actions/auth.actions';

interface HeaderBarProps {
  username: string;
}

export function HeaderBar({ username }: HeaderBarProps) {
  const initials = username
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2) || 'US';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Marca / Logo */}
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/20">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                FinanzasPro
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                Wealth MVP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Patrimonio Personal y Cartera de Inversión
            </p>
          </div>
        </Link>

        {/* Navegación rápida */}
        <nav className="flex flex-wrap items-center gap-1">
          <Link
            href="/#resumen"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Resumen
          </Link>
          <Link
            href="/#graficos"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white md:flex"
          >
            <PieChart className="h-3.5 w-3.5 text-blue-400" />
            Gráficos
          </Link>
          <Link
            href="/#cuentas"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white md:flex"
          >
            <Wallet className="h-3.5 w-3.5 text-indigo-400" />
            Mis Cuentas
          </Link>
          <Link
            href="/#inversiones"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white md:flex"
          >
            <LineChart className="h-3.5 w-3.5 text-amber-400" />
            Inversiones
          </Link>
          <Link
            href="/movimientos"
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 transition hover:border-purple-500/60 hover:bg-purple-500/20 hover:text-white"
          >
            <ReceiptText className="h-3.5 w-3.5 text-purple-400" />
            Movimientos
          </Link>
        </nav>

        {/* Estado de sesión + Cerrar sesión */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 shadow-inner">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-xs font-bold text-white">
              {initials}
              <span
                className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400"
                title="Sesión activa"
              />
            </div>
            <span className="text-xs text-slate-300 sm:text-sm">
              Conectado como:{' '}
              <strong className="font-semibold text-white">{username}</strong>
            </span>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 transition hover:border-rose-500/60 hover:bg-rose-500/20 hover:text-white"
              title="Cerrar sesión y volver a /login"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

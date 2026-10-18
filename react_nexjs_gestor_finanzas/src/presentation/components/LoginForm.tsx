'use client';

import { useActionState } from 'react';
import { ArrowRight, KeyRound, Landmark, ShieldCheck, Sparkles, User } from 'lucide-react';
import { AuthActionState, loginAction } from '../actions/auth.actions';

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl">
      {/* Cabecera de marca */}
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/25">
          <Landmark className="h-7 w-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          Banca Privada & Wealth Management
        </div>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white">
          Acceso a FinanzasPro
        </h1>
        <p className="mt-1.5 text-xs text-slate-400">
          Introduce cualquier usuario y contraseña para explorar el MVP completo
        </p>
      </div>

      {/* Formulario Fake Login */}
      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Nombre de Usuario
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              placeholder="Ej. Rubén Muñoz"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Contraseña
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {state.error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-300">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-blue-500 disabled:opacity-50"
        >
          <span>{isPending ? 'Iniciando sesión...' : 'Entrar al Dashboard'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Nota informativa del modo Demo / Fake Login */}
      <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs text-slate-400">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        <p>
          <strong className="text-slate-200">Modo Demo Fintech:</strong> No requiere registro previo. Cualquier nombre de usuario y contraseña no vacíos iniciarán sesión con tu identidad en la barra superior.
        </p>
      </div>
    </div>
  );
}

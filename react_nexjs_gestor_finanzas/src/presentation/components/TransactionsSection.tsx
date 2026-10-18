'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Filter,
  Plus,
  Search,
  Tag,
  X,
} from 'lucide-react';
import {
  AccountDTO,
  CategoryDTO,
  TransactionDTO,
} from '../../application/dtos/financial.dtos';
import {
  CreateTransactionActionState,
  createTransactionAction,
} from '../actions/transaction.actions';

interface TransactionsSectionProps {
  transactions: TransactionDTO[];
  accounts: AccountDTO[];
  categories: CategoryDTO[];
}

const initialActionState: CreateTransactionActionState = {};

export function TransactionsSection({
  transactions,
  accounts,
  categories,
}: TransactionsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [accountFilter, setAccountFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTxType, setNewTxType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  const [state, formAction, isPending] = useActionState(
    createTransactionAction,
    initialActionState
  );

  // Cerrar el modal automáticamente cuando se guarda con éxito
  useEffect(() => {
    if (state.success && state.timestamp) {
      setIsModalOpen(false);
    }
  }, [state.success, state.timestamp]);

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === newTxType),
    [categories, newTxType]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (accountFilter !== 'ALL' && tx.accountId !== accountFilter) {
        return false;
      }
      if (typeFilter !== 'ALL' && tx.type !== typeFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchConcept = tx.concept.toLowerCase().includes(q);
        const matchCategory = tx.categoryName.toLowerCase().includes(q);
        const matchAccount = tx.accountName.toLowerCase().includes(q);
        if (!matchConcept && !matchCategory && !matchAccount) return false;
      }
      return true;
    });
  }, [transactions, accountFilter, typeFilter, searchTerm]);

  const todayIsoDate = new Date().toISOString().split('T')[0];

  return (
    <section id="movimientos" className="scroll-mt-20">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Últimos Movimientos Financieros
          </h2>
          <p className="text-xs text-slate-400">
            Filtra por cuenta, categoría o añade un nuevo ingreso/gasto con actualización en MySQL
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-blue-500 sm:text-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Movimiento
        </button>
      </div>

      {state.success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          Movimiento registrado en MySQL y saldo de cuenta actualizado en tiempo real.
        </div>
      )}

      {/* Barra de filtros y búsqueda */}
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 md:grid-cols-12">
        {/* Buscador */}
        <div className="relative md:col-span-5">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por concepto, categoría o cuenta..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2 pr-3 pl-10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none sm:text-sm"
          />
        </div>

        {/* Filtro por Cuenta */}
        <div className="relative md:col-span-4">
          <Filter className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2 pr-3 pl-10 text-xs text-white focus:border-emerald-500 focus:outline-none sm:text-sm"
          >
            <option value="ALL">Todas las cuentas ({accounts.length})</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.bank})
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Tipo */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 md:col-span-3">
          <button
            type="button"
            onClick={() => setTypeFilter('ALL')}
            className={`flex-1 cursor-pointer rounded-lg py-1.5 text-xs font-semibold transition ${
              typeFilter === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('INCOME')}
            className={`flex-1 cursor-pointer rounded-lg py-1.5 text-xs font-semibold transition ${
              typeFilter === 'INCOME'
                ? 'bg-emerald-600/30 text-emerald-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ingresos
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('EXPENSE')}
            className={`flex-1 cursor-pointer rounded-lg py-1.5 text-xs font-semibold transition ${
              typeFilter === 'EXPENSE'
                ? 'bg-rose-600/30 text-rose-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gastos
          </button>
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5 font-semibold">Fecha</th>
                <th className="px-4 py-3.5 font-semibold">Concepto</th>
                <th className="px-4 py-3.5 font-semibold">Categoría</th>
                <th className="px-4 py-3.5 font-semibold">Cuenta</th>
                <th className="px-5 py-3.5 text-right font-semibold">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-slate-400"
                  >
                    No se encontraron movimientos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  const formattedDate = new Date(tx.dateIso).toLocaleDateString(
                    'es-ES',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }
                  );

                  return (
                    <tr
                      key={tx.id}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-400">
                        {formattedDate}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                              isIncome
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-rose-500/15 text-rose-400'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </span>
                          <span className="font-medium text-white">
                            {tx.concept}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/90 px-2.5 py-0.5 text-xs font-medium text-slate-200">
                          <Tag className="h-3 w-3 text-slate-400" />
                          {tx.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-300">
                        {tx.accountName}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right font-bold">
                        <span
                          className={
                            isIncome ? 'text-emerald-400' : 'text-rose-400'
                          }
                        >
                          {isIncome ? '+' : '-'}
                          {tx.amountFormatted}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Añadir Nuevo Movimiento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Registrar Nuevo Movimiento
                </h3>
                <p className="text-xs text-slate-400">
                  Actualiza automáticamente el saldo de la cuenta en MySQL
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              {/* Selector de Tipo: Gasto vs Ingreso */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tipo de Movimiento
                </label>
                <input type="hidden" name="type" value={newTxType} />
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-950 p-1">
                  <button
                    type="button"
                    onClick={() => setNewTxType('EXPENSE')}
                    className={`cursor-pointer rounded-lg py-2 text-xs font-bold transition ${
                      newTxType === 'EXPENSE'
                        ? 'bg-rose-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Gasto (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTxType('INCOME')}
                    className={`cursor-pointer rounded-lg py-2 text-xs font-bold transition ${
                      newTxType === 'INCOME'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ingreso (+)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Cuenta */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Cuenta Bancaria / Efectivo
                  </label>
                  <select
                    name="accountId"
                    required
                    defaultValue={accounts[0]?.id ?? ''}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.balanceFormatted})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categoría */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Categoría ({newTxType === 'INCOME' ? 'Ingreso' : 'Gasto'})
                  </label>
                  <select
                    name="categoryId"
                    required
                    defaultValue={filteredCategories[0]?.id ?? ''}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {filteredCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Importe en Euros */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Importe (€ EUR)
                  </label>
                  <input
                    type="number"
                    name="amountDecimal"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="Ej. 45.90"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Fecha */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Fecha del Movimiento
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={todayIsoDate}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Concepto */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Concepto / Descripción
                </label>
                <input
                  type="text"
                  name="concept"
                  required
                  placeholder="Ej. Compra semanal Mercadona, Cena, Factura..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {state.error && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                  {state.error}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="cursor-pointer rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg transition hover:from-emerald-400 hover:to-blue-500 disabled:opacity-50"
                >
                  {isPending ? 'Guardando...' : 'Guardar Movimiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

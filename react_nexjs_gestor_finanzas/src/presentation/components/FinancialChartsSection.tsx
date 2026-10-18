'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, WalletCards } from 'lucide-react';
import {
  AssetAllocationItemDTO,
  CategoryExpenseShareDTO,
  MonthlyCashflowPointDTO,
} from '../../application/dtos/financial.dtos';

interface FinancialChartsSectionProps {
  monthlyCashflow: MonthlyCashflowPointDTO[];
  expensesByCategory: CategoryExpenseShareDTO[];
  assetAllocation: AssetAllocationItemDTO[];
}

function formatEuros(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value);
}

export function FinancialChartsSection({
  monthlyCashflow,
  expensesByCategory,
  assetAllocation,
}: FinancialChartsSectionProps) {
  const [chartMode, setChartMode] = useState<'bar' | 'area'>('bar');

  return (
    <section id="graficos" className="scroll-mt-20 space-y-6">
      {/* 1. Gráfico de Evolución de Ingresos vs Gastos (6 meses) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-lg sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Evolución de Ingresos vs Gastos (Últimos 6 Meses)
              </h2>
              <p className="text-xs text-slate-400">
                Comparativa mensual de flujo de caja y ahorro neto generado
              </p>
            </div>
          </div>

          <div className="inline-flex self-start rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs sm:self-auto">
            <button
              type="button"
              onClick={() => setChartMode('bar')}
              className={`cursor-pointer rounded-lg px-3 py-1.5 font-medium transition ${
                chartMode === 'bar'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Barras
            </button>
            <button
              type="button"
              onClick={() => setChartMode('area')}
              className={`cursor-pointer rounded-lg px-3 py-1.5 font-medium transition ${
                chartMode === 'area'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Área
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'bar' ? (
              <BarChart
                data={monthlyCashflow}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="monthLabel"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(v) => `${v} €`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value) => formatEuros(Number(value))}
                />
                <Bar
                  dataKey="incomeDecimal"
                  name="Ingresos"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="expenseDecimal"
                  name="Gastos"
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            ) : (
              <AreaChart
                data={monthlyCashflow}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="monthLabel"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(v) => `${v} €`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value) => formatEuros(Number(value))}
                />
                <Area
                  type="monotone"
                  dataKey="incomeDecimal"
                  name="Ingresos"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expenseDecimal"
                  name="Gastos"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Dos gráficos en paralelo: Gastos por Categoría y Distribución del Patrimonio */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Distribución de Gastos por Categoría (Donut) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-lg sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="rounded-xl bg-rose-500/15 p-2 text-rose-400">
              <PieChartIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Distribución de Gastos por Categoría
              </h2>
              <p className="text-xs text-slate-400">
                Desglose porcentual acumulado en los últimos 6 meses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    dataKey="amountDecimal"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={3}
                  >
                    {expensesByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value) => formatEuros(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5">
              {expensesByCategory.map((item) => (
                <div
                  key={item.categoryId}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-200">
                      {item.categoryName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {item.amountFormatted}
                    </span>
                    <span className="w-11 text-right text-slate-400">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribución del Patrimonio / Cartera por Tipo de Activo */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-lg sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400">
              <WalletCards className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Distribución del Patrimonio por Activo
              </h2>
              <p className="text-xs text-slate-400">
                Composición entre Liquidez, ETFs, Acciones, Bonos y Crypto
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    dataKey="amountDecimal"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={3}
                  >
                    {assetAllocation.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value) => formatEuros(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {assetAllocation.map((asset) => (
                <div key={asset.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-slate-200">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: asset.color }}
                      />
                      {asset.label}
                    </span>
                    <span className="font-semibold text-white">
                      {asset.amountFormatted}{' '}
                      <span className="text-slate-400">({asset.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, asset.percentage)}%`,
                        backgroundColor: asset.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Calendar,
  PieChart,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';

export const GymInsightsView: React.FC = () => {
  const [period, setPeriod] = useState<'WEEK' | 'MONTH' | 'YEAR' | 'ALL'>('MONTH');

  const members = db.getMembers();
  const expenses = db.getExpenses();
  const packages = db.getPackages();
  const categories = db.getCategories();

  // Metrics
  const totalRevenue = members.reduce((sum, m) => sum + (parseFloat(m.pamount) || 0), 0);
  const totalDues = members.reduce((sum, m) => sum + (parseFloat(m.damount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Package distribution
  const packageStats = packages.map(pkg => {
    const count = members.filter(m => m.packageId === pkg.packageId).length;
    const revenue = count * pkg.price;
    return { ...pkg, count, revenue };
  });

  // Expense by category
  const expenseStats = categories.map(cat => {
    const spent = expenses.filter(e => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0);
    return { ...cat, spent };
  });

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Header & Period Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <span>Gym Financial & Growth Insights</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Revenue velocity, operational expenses, member lifetime value & trends
          </p>
        </div>

        {/* Time Period Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700">
          {[
            { id: 'WEEK', label: 'This Week' },
            { id: 'MONTH', label: 'This Month' },
            { id: 'YEAR', label: 'This Year' },
            { id: 'ALL', label: 'All Time' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === t.id
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Health Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Revenue</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> High Collection Rate
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Expenses</span>
          <div className="text-2xl font-black text-red-500 mt-2">
            ₹{totalExpenses.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Across {expenses.length} expense entries
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Net Operating Profit</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{netProfit.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Profit Margin: {totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Receivables / Dues</span>
          <div className="text-2xl font-black text-amber-500 mt-2">
            ₹{totalDues.toLocaleString()}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-semibold">
            Pending collection from members
          </p>
        </div>
      </div>

      {/* Two Column Graphs & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Popularity & Revenue Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Package Popularity & Performance
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{packages.length} Plans</span>
          </div>

          <div className="space-y-4">
            {packageStats.map(pkg => {
              const maxCount = Math.max(...packageStats.map(p => p.count), 1);
              const percentage = Math.round((pkg.count / maxCount) * 100);

              return (
                <div key={pkg.packageId} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{pkg.name}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {pkg.count} members (₹{pkg.revenue.toLocaleString()})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-red-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Operational Expense Categories
              </h3>
            </div>
            <span className="text-xs text-red-500 font-bold">₹{totalExpenses.toLocaleString()}</span>
          </div>

          <div className="space-y-4">
            {expenseStats.map(cat => {
              const maxSpent = Math.max(...expenseStats.map(c => c.spent), 1);
              const percentage = Math.round((cat.spent / maxSpent) * 100);

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{cat.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      ₹{cat.spent.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


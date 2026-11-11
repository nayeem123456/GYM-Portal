import React, { useState } from 'react';
import { Receipt, PlusCircle, Trash2, Calendar, Tag, DollarSign, Filter, X } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { ExpenseDto } from '../../types';

export const ExpenseManagerView: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseDto[]>(db.getExpenses());
  const [categories] = useState(db.getCategories());
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New expense form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const reload = () => setExpenses(db.getExpenses());

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    const cat = categories.find(c => c.id === categoryId);
    const newExp: ExpenseDto = {
      id: `exp_${Date.now()}`,
      title: title.trim(),
      amount: parseFloat(amount),
      categoryId,
      categoryName: cat?.name || 'General',
      date,
      paymentMethod
    };

    db.saveExpense(newExp);
    setTitle('');
    setAmount('');
    setIsAddOpen(false);
    reload();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this expense entry?')) {
      db.deleteExpense(id);
      reload();
    }
  };

  const filtered = selectedCat === 'ALL'
    ? expenses
    : expenses.filter(e => e.categoryId === selectedCat);

  const totalSpent = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-red-500" />
            <span>Operational Expense Manager</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track rent, utilities, trainer payroll, maintenance and supply costs
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Summary Card & Category Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Filtered Outflow</span>
          <div className="text-2xl font-black text-red-500 mt-2">
            ₹{totalSpent.toLocaleString()}
          </div>
          <span className="text-xs text-slate-400 mt-1">{filtered.length} entries recorded</span>
        </div>

        {/* Categories Bar */}
        <div className="md:col-span-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by Category:
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <button
              onClick={() => setSelectedCat('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCat === 'ALL'
                  ? 'bg-red-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  selectedCat === c.id
                    ? 'bg-red-500 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
          <span>Expense Item</span>
          <span>Category & Date</span>
          <span>Payment & Amount</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">
              No expenses found for this category.
            </div>
          ) : (
            filtered.map(exp => (
              <div
                key={exp.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{exp.title}</p>
                  <p className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3" /> {exp.date}
                  </p>
                </div>

                <div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {exp.categoryName}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono text-sm font-black text-red-500">
                      ₹{exp.amount.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-400">{exp.paymentMethod}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Record Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-red-500" /> Record Gym Expense
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Expense Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Gym Floor AC Servicing"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-md shadow-red-500/20 active:scale-95 transition-all"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


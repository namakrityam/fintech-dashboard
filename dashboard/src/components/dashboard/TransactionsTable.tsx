import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Pencil, Trash2, X, Filter, FileDown, Package } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Transaction, Category, TransactionType } from '@/lib/types';
import { formatINR, getAvailableMonths } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const allCategories: Category[] = [
  'Salary','Freelance','Investment','Food','Transport','Shopping','Bills','Entertainment','Health','Education','Travel','Utilities','Other',
];

export function TransactionsTable() {
  const { transactions, filters, setFilter, role, deleteTransaction } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const months = getAvailableMonths(transactions);

  // Apply filters
  let filtered = [...transactions];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  if (filters.category !== 'all') filtered = filtered.filter(t => t.category === filters.category);
  if (filters.type !== 'all') filtered = filtered.filter(t => t.type === filters.type);
  if (filters.month !== 'all') filtered = filtered.filter(t => t.date.startsWith(filters.month));

  filtered.sort((a, b) => {
    const dir = filters.sortDirection === 'asc' ? 1 : -1;
    if (filters.sortField === 'date') return a.date.localeCompare(b.date) * dir;
    return (a.amount - b.amount) * dir;
  });

  const handleExportCSV = () => {
    const header = 'Date,Description,Category,Type,Amount\n';
    const rows = filtered.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Search transactions..."
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value as any)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Categories</option>
          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilter('type', e.target.value as any)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.month}
          onChange={(e) => setFilter('month', e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Months</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          value={`${filters.sortField}-${filters.sortDirection}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split('-') as any;
            setFilter('sortField', field);
            setFilter('sortDirection', dir);
          }}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>

        <button onClick={handleExportCSV} className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center gap-1.5">
          <FileDown className="h-3.5 w-3.5" /> CSV
        </button>

        {role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="h-9 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No transactions found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters or search query.</p>
        </motion.div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Amount</th>
                {role === 'admin' && <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/50 transition-colors hover:bg-accent/30"
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{t.date}</td>
                  <td className="px-4 py-3 text-xs font-medium text-foreground">{t.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold',
                      t.type === 'income'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}>
                      {t.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className={cn(
                    'px-4 py-3 text-right text-xs font-semibold tabular-nums',
                    t.type === 'income' ? 'trend-positive' : 'text-foreground'
                  )}>
                    {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                  </td>
                  {role === 'admin' && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add modal */}
      <AnimatePresence>
        {showAddModal && <AddTransactionModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AddTransactionModal({ onClose }: { onClose: () => void }) {
  const addTransaction = useStore(s => s.addTransaction);
  const [form, setForm] = useState({
    date: new Date().toISOString().substring(0, 10),
    description: '',
    amount: '',
    category: 'Food' as Category,
    type: 'expense' as TransactionType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    addTransaction({
      date: form.date,
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Add Transaction</h3>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm(f => ({ ...f, category: e.target.value as Category }))}
              className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={form.type}
              onChange={(e) => setForm(f => ({ ...f, type: e.target.value as TransactionType }))}
              className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <button type="submit" className="h-9 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Add Transaction
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BalanceTrendChart, IncomeVsExpenseChart, SpendingBreakdown } from '@/components/dashboard/Charts';
import { useStore } from '@/store/useStore';
import { getMonthlyTrend, formatINR } from '@/lib/analytics';
import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';

export default function ReportsPage() {
  const transactions = useStore(s => s.transactions);
  const trend = getMonthlyTrend(transactions);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.json';
    a.click();
  };

  return (
    <DashboardLayout title="Reports" subtitle="Financial reports and exports">
      <div className="space-y-6 max-w-7xl">
        {/* Summary table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Monthly Summary</p>
            <button onClick={handleExportJSON} className="h-8 rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center gap-1.5">
              <FileDown className="h-3.5 w-3.5" /> Export JSON
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Month</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Income</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Expenses</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Net</th>
                </tr>
              </thead>
              <tbody>
                {trend.map(t => (
                  <tr key={t.month} className="border-b border-border/50">
                    <td className="px-4 py-2 text-xs text-foreground font-medium">{t.month}</td>
                    <td className="px-4 py-2 text-right text-xs trend-positive tabular-nums">{formatINR(t.income)}</td>
                    <td className="px-4 py-2 text-right text-xs text-foreground tabular-nums">{formatINR(t.expenses)}</td>
                    <td className={`px-4 py-2 text-right text-xs font-semibold tabular-nums ${t.balance >= 0 ? 'trend-positive' : 'trend-negative'}`}>
                      {formatINR(t.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <BalanceTrendChart />
          <IncomeVsExpenseChart />
        </div>

        <SpendingBreakdown />
      </div>
    </DashboardLayout>
  );
}

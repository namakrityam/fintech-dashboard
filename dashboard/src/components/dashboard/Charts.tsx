import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { useStore } from '@/store/useStore';
import {
  getMonthlyTrend, getBalanceTrend, getCategoryBreakdown, getMonthTransactions, getCurrentMonth, formatINR, formatCompactINR,
} from '@/lib/analytics';

const CHART_COLORS = [
  'hsl(230, 65%, 52%)', 'hsl(152, 60%, 40%)', 'hsl(38, 92%, 50%)',
  'hsl(280, 60%, 55%)', 'hsl(350, 65%, 55%)', 'hsl(190, 70%, 45%)',
  'hsl(15, 80%, 55%)', 'hsl(60, 70%, 45%)', 'hsl(320, 60%, 50%)',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: {formatINR(p.value)}
        </p>
      ))}
    </div>
  );
};

export function BalanceTrendChart() {
  const transactions = useStore((s) => s.transactions);
  const data = getBalanceTrend(transactions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="metric-card"
    >
      <p className="section-title mb-4">Balance Trend</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompactINR(v)} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 3, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function IncomeVsExpenseChart() {
  const transactions = useStore((s) => s.transactions);
  const data = getMonthlyTrend(transactions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="metric-card"
    >
      <p className="section-title mb-4">Income vs Expenses</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompactINR(v)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="income" name="Income" fill="hsl(152, 60%, 40%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function SpendingBreakdown() {
  const transactions = useStore((s) => s.transactions);
  const current = getMonthTransactions(transactions, getCurrentMonth());
  const data = getCategoryBreakdown(current);

  if (data.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="metric-card flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground">No expense data for this month.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="metric-card"
    >
      <p className="section-title mb-4">Spending Breakdown</p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                strokeWidth={2}
                stroke="hsl(var(--card))"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {data.slice(0, 6).map((item, i) => (
            <div key={item.category} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="flex-1 text-xs text-foreground truncate">{item.category}</span>
              <span className="text-xs font-medium text-foreground tabular-nums">{item.percentage}%</span>
              <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">{formatINR(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

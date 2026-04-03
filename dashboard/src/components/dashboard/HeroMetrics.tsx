import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Wallet, ArrowDownLeft, ArrowUpRight, Percent } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store/useStore';
import {
  getMonthTransactions,
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getSavingsRate,
  getCurrentMonth,
  getPreviousMonth,
  getMonthlyTrend,
  formatINR,
} from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  sparkData: number[];
  severity: 'positive' | 'negative' | 'neutral';
  delay: number;
}

function MetricCard({ label, value, trend, icon, sparkData, severity, delay }: MetricCardProps) {
  const trendColor = severity === 'positive' ? 'trend-positive' : severity === 'negative' ? 'trend-negative' : 'trend-neutral';
  const sparkColor = severity === 'positive' ? 'hsl(152, 60%, 40%)' : severity === 'negative' ? 'hsl(0, 72%, 51%)' : 'hsl(220, 10%, 46%)';
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="metric-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
          {icon}
        </div>
        <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
          <TrendIcon className="h-3 w-3" />
          <span>{Math.abs(Math.round(trend))}%</span>
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="value-large">{value}</p>
      <div className="mt-3 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData.map((v, i) => ({ v }))}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={sparkColor}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function HeroMetrics() {
  const transactions = useStore((s) => s.transactions);
  const currentMonth = getCurrentMonth();
  const prevMonth = getPreviousMonth();

  const current = getMonthTransactions(transactions, currentMonth);
  const prev = getMonthTransactions(transactions, prevMonth);

  const curIncome = getTotalIncome(current);
  const prevIncome = getTotalIncome(prev);
  const curExpenses = getTotalExpenses(current);
  const prevExpenses = getTotalExpenses(prev);
  const curBalance = getBalance(transactions);
  const curSavingsRate = getSavingsRate(curIncome, curExpenses);
  const prevSavingsRate = getSavingsRate(prevIncome, prevExpenses);

  const trend = getMonthlyTrend(transactions);
  const balanceSpark = trend.map(t => t.balance);
  const incomeSpark = trend.map(t => t.income);
  const expenseSpark = trend.map(t => t.expenses);
  const savingsSpark = trend.map(t => t.income > 0 ? ((t.income - t.expenses) / t.income) * 100 : 0);

  const incomeTrend = prevIncome > 0 ? ((curIncome - prevIncome) / prevIncome) * 100 : 0;
  const expenseTrend = prevExpenses > 0 ? ((curExpenses - prevExpenses) / prevExpenses) * 100 : 0;
  const balanceTrend = trend.length >= 2 ? ((trend[trend.length - 1].balance - trend[trend.length - 2].balance) / Math.abs(trend[trend.length - 2].balance || 1)) * 100 : 0;
  const savingsTrend = prevSavingsRate > 0 ? curSavingsRate - prevSavingsRate : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Total Balance"
        value={formatINR(curBalance)}
        trend={balanceTrend}
        icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        sparkData={balanceSpark}
        severity={curBalance > 0 ? 'positive' : 'negative'}
        delay={0}
      />
      <MetricCard
        label="Monthly Income"
        value={formatINR(curIncome)}
        trend={incomeTrend}
        icon={<ArrowDownLeft className="h-4 w-4 text-muted-foreground" />}
        sparkData={incomeSpark}
        severity={incomeTrend >= 0 ? 'positive' : 'negative'}
        delay={0.05}
      />
      <MetricCard
        label="Monthly Expenses"
        value={formatINR(curExpenses)}
        trend={expenseTrend}
        icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
        sparkData={expenseSpark}
        severity={expenseTrend <= 0 ? 'positive' : 'negative'}
        delay={0.1}
      />
      <MetricCard
        label="Savings Rate"
        value={`${curSavingsRate}%`}
        trend={savingsTrend}
        icon={<Percent className="h-4 w-4 text-muted-foreground" />}
        sparkData={savingsSpark}
        severity={curSavingsRate >= 30 ? 'positive' : curSavingsRate >= 15 ? 'neutral' : 'negative'}
        delay={0.15}
      />
    </div>
  );
}

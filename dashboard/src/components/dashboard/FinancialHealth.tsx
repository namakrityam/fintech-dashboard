import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { getFinancialHealthScore, getMonthTransactions, getCurrentMonth } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function FinancialHealth() {
  const transactions = useStore((s) => s.transactions);
  const { score, label, factors } = getFinancialHealthScore(transactions);

  const color =
    score >= 80 ? 'hsl(152, 60%, 40%)' :
    score >= 60 ? 'hsl(200, 70%, 50%)' :
    score >= 40 ? 'hsl(38, 92%, 50%)' :
    'hsl(0, 72%, 51%)';

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const labelColor =
    score >= 80 ? 'trend-positive' :
    score >= 60 ? 'text-blue-500' :
    score >= 40 ? 'text-amber-500' :
    'trend-negative';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="metric-card flex flex-col sm:flex-row items-center gap-6"
    >
      {/* Radial gauge */}
      <div className="relative shrink-0">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r="54"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          <motion.circle
            cx="70"
            cy="70"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{score}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Financial Health</p>
        <p className={cn('text-xl font-bold', labelColor)}>{label}</p>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          {score >= 80
            ? 'Your finances are in great shape. Keep maintaining this discipline.'
            : score >= 60
            ? "You're on a solid track. A few optimizations could push you higher."
            : score >= 40
            ? 'Some areas need attention. Review your spending patterns.'
            : 'Your financial health needs immediate attention.'}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {factors.map((f) => (
            <div key={f.name} className="rounded-lg bg-accent px-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-muted-foreground">{f.name}</span>
                <span className="text-[10px] font-semibold text-foreground">{f.score}/{f.max}</span>
              </div>
              <div className="h-1 rounded-full bg-border">
                <div
                  className="h-1 rounded-full transition-all duration-700"
                  style={{
                    width: `${(f.score / f.max) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

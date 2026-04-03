import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Sparkles, AlertTriangle, Award, Info } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { generateInsights } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, TrendingDown, Sparkles, AlertTriangle, Award, Info,
};

const severityStyles = {
  positive: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
  warning: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
  neutral: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
  critical: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
};

const severityIconColors = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  neutral: 'text-blue-600 dark:text-blue-400',
  critical: 'text-red-600 dark:text-red-400',
};

export function InsightsPanel() {
  const transactions = useStore((s) => s.transactions);
  const role = useStore((s) => s.role);
  const insights = generateInsights(transactions);

  const visibleInsights = role === 'analyst' ? insights : insights.slice(0, 4);

  if (visibleInsights.length === 0) {
    return (
      <div className="metric-card flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">No insights available. Add more transactions to generate analysis.</p>
      </div>
    );
  }

  // Find the critical/warning insight for alert card
  const alertInsight = insights.find(i => i.severity === 'critical');

  return (
    <div className="space-y-4">
      {alertInsight && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-xl border border-red-200 bg-red-50/70 p-4 dark:border-red-800/40 dark:bg-red-950/30"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">{alertInsight.title}</p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">{alertInsight.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {visibleInsights.filter(i => i.id !== alertInsight?.id).map((insight, i) => {
          const Icon = iconMap[insight.icon] || Info;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              className={cn(
                'rounded-lg border-l-[3px] p-4 transition-all',
                severityStyles[insight.severity]
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn('h-4 w-4 shrink-0 mt-0.5', severityIconColors[insight.severity])} />
                <div>
                  <p className="text-xs font-semibold text-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

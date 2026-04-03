import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { FinancialHealth } from '@/components/dashboard/FinancialHealth';
import { SpendingBreakdown } from '@/components/dashboard/Charts';
import { useStore } from '@/store/useStore';

export default function InsightsPage() {
  const role = useStore(s => s.role);

  return (
    <DashboardLayout title="Insights" subtitle={role === 'analyst' ? 'Deep analysis and recommendations' : 'Key financial insights'}>
      <div className="space-y-6 max-w-7xl">
        <FinancialHealth />
        <SpendingBreakdown />
        <div>
          <p className="section-title mb-3">All Insights</p>
          <InsightsPanel />
        </div>

        {role === 'analyst' && (
          <div className="metric-card">
            <p className="section-title mb-2">Analyst Notes</p>
            <p className="text-xs text-muted-foreground">
              As an analyst, you have access to deeper comparisons and trend analysis.
              The insights above include additional spike detection and category-level improvements
              that are hidden from standard viewer accounts.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

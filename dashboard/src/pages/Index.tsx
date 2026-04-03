import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HeroMetrics } from '@/components/dashboard/HeroMetrics';
import { FinancialHealth } from '@/components/dashboard/FinancialHealth';
import { BalanceTrendChart, IncomeVsExpenseChart, SpendingBreakdown } from '@/components/dashboard/Charts';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { useStore } from '@/store/useStore';
import { getCurrentMonth } from '@/lib/analytics';

export default function OverviewPage() {
  const role = useStore(s => s.role);

  return (
    <DashboardLayout title="Overview" subtitle={`Financial summary for ${getCurrentMonth()}`}>
      <div className="space-y-6 max-w-7xl">
        {/* Hero Metrics */}
        <HeroMetrics />

        {/* Financial Health */}
        <FinancialHealth />

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <BalanceTrendChart />
          <IncomeVsExpenseChart />
        </div>

        <SpendingBreakdown />

        {/* Insights */}
        <div>
          <p className="section-title mb-3">Smart Insights</p>
          <InsightsPanel />
        </div>

        {/* Recent Transactions */}
        <div>
          <p className="section-title mb-3">Recent Transactions</p>
          <TransactionsTable />
        </div>
      </div>
    </DashboardLayout>
  );
}

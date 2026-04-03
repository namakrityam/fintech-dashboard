import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';

export default function TransactionsPage() {
  return (
    <DashboardLayout title="Transactions" subtitle="View and manage all transactions">
      <div className="max-w-7xl">
        <TransactionsTable />
      </div>
    </DashboardLayout>
  );
}

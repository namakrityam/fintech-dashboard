import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { Role } from '@/lib/types';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { role, setRole, theme, toggleTheme, transactions, resetFilters } = useStore();

  return (
    <DashboardLayout title="Settings" subtitle="Manage preferences and data">
      <div className="max-w-2xl space-y-6">
        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="metric-card">
          <p className="text-sm font-semibold text-foreground mb-1">Appearance</p>
          <p className="text-xs text-muted-foreground mb-3">Choose your preferred theme.</p>
          <div className="flex gap-2">
            {(['light', 'dark'] as const).map(t => (
              <button
                key={t}
                onClick={() => useStore.getState().setTheme(t)}
                className={`h-9 rounded-lg border px-4 text-xs font-medium transition-colors ${
                  theme === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'
                }`}
              >
                {t === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Role */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="metric-card">
          <p className="text-sm font-semibold text-foreground mb-1">Role</p>
          <p className="text-xs text-muted-foreground mb-3">Switch between roles to see different dashboard experiences.</p>
          <div className="flex gap-2">
            {(['viewer', 'admin', 'analyst'] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`h-9 rounded-lg border px-4 text-xs font-medium capitalize transition-colors ${
                  role === r ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Data */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="metric-card">
          <p className="text-sm font-semibold text-foreground mb-1">Data</p>
          <p className="text-xs text-muted-foreground mb-3">
            {transactions.length} transactions stored locally. Data persists via localStorage.
          </p>
          <button
            onClick={resetFilters}
            className="h-9 rounded-lg border border-border px-4 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            Reset All Filters
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

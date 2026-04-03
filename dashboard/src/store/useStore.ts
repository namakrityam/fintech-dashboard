import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Role, Filters, Category, TransactionType } from '@/lib/types';
import { generateMockTransactions } from '@/lib/mockData';

interface AppState {
  transactions: Transaction[];
  role: Role;
  theme: 'light' | 'dark';
  filters: Filters;
  sidebarOpen: boolean;
  activeSection: string;

  // Actions
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setRole: (role: Role) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
}

const defaultFilters: Filters = {
  search: '',
  category: 'all',
  type: 'all',
  month: 'all',
  sortField: 'date',
  sortDirection: 'desc',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: generateMockTransactions(),
      role: 'admin',
      theme: 'light',
      filters: { ...defaultFilters },
      sidebarOpen: true,
      activeSection: 'overview',

      addTransaction: (t) =>
        set((state) => ({
          transactions: [
            { ...t, id: Math.random().toString(36).substring(2, 10) },
            ...state.transactions,
          ],
        })),

      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
      resetFilters: () => set({ filters: { ...defaultFilters } }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveSection: (section) => set({ activeSection: section }),
    }),
    {
      name: 'finance-dashboard',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }),
    }
  )
);

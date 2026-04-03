export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Travel'
  | 'Utilities'
  | 'Investment'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
  tags?: string[];
}

export type Role = 'viewer' | 'admin' | 'analyst';

export type SortField = 'date' | 'amount';
export type SortDirection = 'asc' | 'desc';

export interface Filters {
  search: string;
  category: Category | 'all';
  type: TransactionType | 'all';
  month: string; // 'all' or 'YYYY-MM'
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'positive' | 'warning' | 'neutral' | 'critical';
  icon: string;
}

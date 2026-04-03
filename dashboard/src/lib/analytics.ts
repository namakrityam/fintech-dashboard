import { Transaction, Insight, Category } from './types';
import { format, subMonths, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function getMonthTransactions(transactions: Transaction[], monthStr: string): Transaction[] {
  if (monthStr === 'all') return transactions;
  const [year, month] = monthStr.split('-').map(Number);
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return transactions.filter(t => {
    const d = parseISO(t.date);
    return isWithinInterval(d, { start, end });
  });
}

export function getCurrentMonth(): string {
  return '2025-06';
}

export function getPreviousMonth(): string {
  return '2025-05';
}

export function getAvailableMonths(transactions: Transaction[]): string[] {
  const months = new Set(transactions.map(t => t.date.substring(0, 7)));
  return Array.from(months).sort().reverse();
}

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
}

export function getBalance(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
}

export function getSavingsRate(income: number, expenses: number): number {
  if (income === 0) return 0;
  return Math.round(((income - expenses) / income) * 100);
}

export function getMonthlyTrend(transactions: Transaction[]): { month: string; income: number; expenses: number; balance: number }[] {
  const months = Array.from(new Set(transactions.map(t => t.date.substring(0, 7)))).sort();
  return months.map(m => {
    const mt = getMonthTransactions(transactions, m);
    const income = getTotalIncome(mt);
    const expenses = getTotalExpenses(mt);
    return {
      month: format(parseISO(`${m}-01`), 'MMM'),
      income,
      expenses,
      balance: income - expenses,
    };
  });
}

export function getCategoryBreakdown(transactions: Transaction[]): { category: string; amount: number; percentage: number }[] {
  const expenses = transactions.filter(t => t.type === 'expense');
  const total = expenses.reduce((s, t) => s + t.amount, 0);
  const map = new Map<string, number>();
  expenses.forEach(t => {
    map.set(t.category, (map.get(t.category) || 0) + t.amount);
  });
  return Array.from(map.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getBalanceTrend(transactions: Transaction[]): { month: string; balance: number }[] {
  const months = Array.from(new Set(transactions.map(t => t.date.substring(0, 7)))).sort();
  let runningBalance = 0;
  return months.map(m => {
    const mt = getMonthTransactions(transactions, m);
    runningBalance += getTotalIncome(mt) - getTotalExpenses(mt);
    return { month: format(parseISO(`${m}-01`), 'MMM'), balance: runningBalance };
  });
}

export function getFinancialHealthScore(transactions: Transaction[]): { score: number; label: string; factors: { name: string; score: number; max: number }[] } {
  const currentMonth = getCurrentMonth();
  const prevMonth = getPreviousMonth();
  const current = getMonthTransactions(transactions, currentMonth);
  const prev = getMonthTransactions(transactions, prevMonth);

  const income = getTotalIncome(current);
  const expenses = getTotalExpenses(current);
  const prevIncome = getTotalIncome(prev);
  const prevExpenses = getTotalExpenses(prev);

  // Factor 1: Savings rate (0-30)
  const savingsRate = getSavingsRate(income, expenses);
  const savingsScore = Math.min(30, Math.max(0, Math.round(savingsRate * 0.6)));

  // Factor 2: Expense control (0-25)
  const expenseGrowth = prevExpenses > 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : 0;
  const expenseScore = expenseGrowth <= 0 ? 25 : expenseGrowth < 10 ? 20 : expenseGrowth < 20 ? 12 : 5;

  // Factor 3: Income stability (0-25)
  const incomeChange = prevIncome > 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
  const incomeScore = incomeChange >= 5 ? 25 : incomeChange >= 0 ? 20 : incomeChange >= -10 ? 12 : 5;

  // Factor 4: Diversification (0-20)
  const categories = getCategoryBreakdown(current);
  const topCategory = categories[0];
  const diversScore = !topCategory ? 10 : topCategory.percentage > 50 ? 8 : topCategory.percentage > 35 ? 14 : 20;

  const score = savingsScore + expenseScore + incomeScore + diversScore;
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Healthy' : score >= 40 ? 'Watchful' : 'Risky';

  return {
    score,
    label,
    factors: [
      { name: 'Savings Rate', score: savingsScore, max: 30 },
      { name: 'Expense Control', score: expenseScore, max: 25 },
      { name: 'Income Stability', score: incomeScore, max: 25 },
      { name: 'Diversification', score: diversScore, max: 20 },
    ],
  };
}

export function generateInsights(transactions: Transaction[]): Insight[] {
  const currentMonth = getCurrentMonth();
  const prevMonth = getPreviousMonth();
  const current = getMonthTransactions(transactions, currentMonth);
  const prev = getMonthTransactions(transactions, prevMonth);

  const insights: Insight[] = [];

  // Highest spending category
  const categories = getCategoryBreakdown(current);
  if (categories.length > 0) {
    insights.push({
      id: '1',
      title: 'Top Spending Category',
      description: `${categories[0].category} is your highest spending category this month at ₹${Math.round(categories[0].amount).toLocaleString('en-IN')} (${categories[0].percentage}%).`,
      severity: 'neutral',
      icon: 'TrendingUp',
    });
  }

  // MoM income change
  const curIncome = getTotalIncome(current);
  const prevIncome = getTotalIncome(prev);
  if (prevIncome > 0) {
    const change = ((curIncome - prevIncome) / prevIncome) * 100;
    insights.push({
      id: '2',
      title: 'Income Trend',
      description: `Income ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(Math.round(change))}% compared to last month.`,
      severity: change >= 0 ? 'positive' : 'warning',
      icon: change >= 0 ? 'TrendingUp' : 'TrendingDown',
    });
  }

  // MoM expense change
  const curExpenses = getTotalExpenses(current);
  const prevExpenses = getTotalExpenses(prev);
  if (prevExpenses > 0) {
    const change = ((curExpenses - prevExpenses) / prevExpenses) * 100;
    insights.push({
      id: '3',
      title: 'Expense Trend',
      description: `Expenses ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(Math.round(change))}% compared to last month.`,
      severity: change <= 0 ? 'positive' : change < 15 ? 'neutral' : 'warning',
      icon: change <= 0 ? 'TrendingDown' : 'TrendingUp',
    });
  }

  // Savings trend
  const trend = getMonthlyTrend(transactions);
  if (trend.length >= 3) {
    const lastThree = trend.slice(-3);
    const savingsIncreasing = lastThree.every((t, i) => i === 0 || t.balance >= lastThree[i - 1].balance);
    if (savingsIncreasing) {
      insights.push({
        id: '4',
        title: 'Savings Momentum',
        description: 'Savings improved steadily over the last 3 months. Keep it up!',
        severity: 'positive',
        icon: 'Sparkles',
      });
    }
  }

  // Unusual spike detection
  if (categories.length >= 2 && prev.length > 0) {
    const prevCats = getCategoryBreakdown(prev);
    for (const cat of categories.slice(0, 3)) {
      const prevCat = prevCats.find(p => p.category === cat.category);
      if (prevCat && cat.amount > prevCat.amount * 1.5) {
        insights.push({
          id: `spike-${cat.category}`,
          title: 'Unusual Spike',
          description: `${cat.category} shows a ${Math.round(((cat.amount - prevCat.amount) / prevCat.amount) * 100)}% spike compared to last month.`,
          severity: 'critical',
          icon: 'AlertTriangle',
        });
        break;
      }
    }
  }

  // Best improved category
  if (categories.length > 0 && prev.length > 0) {
    const prevCats = getCategoryBreakdown(prev);
    let bestImproved = { category: '', change: 0 };
    for (const prevCat of prevCats) {
      const curCat = categories.find(c => c.category === prevCat.category);
      const curAmount = curCat?.amount || 0;
      const reduction = prevCat.amount - curAmount;
      if (reduction > bestImproved.change) {
        bestImproved = { category: prevCat.category, change: reduction };
      }
    }
    if (bestImproved.change > 0) {
      insights.push({
        id: '6',
        title: 'Most Improved',
        description: `${bestImproved.category} spending reduced by ₹${Math.round(bestImproved.change).toLocaleString('en-IN')} from last month.`,
        severity: 'positive',
        icon: 'Award',
      });
    }
  }

  return insights;
}

export function formatINR(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function formatCompactINR(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return formatINR(amount);
}

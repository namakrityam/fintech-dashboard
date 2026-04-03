import { Transaction, Category, TransactionType } from './types';

const categories: { name: Category; type: TransactionType }[] = [
  { name: 'Salary', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Investment', type: 'income' },
  { name: 'Food', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Bills', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Health', type: 'expense' },
  { name: 'Education', type: 'expense' },
  { name: 'Travel', type: 'expense' },
  { name: 'Utilities', type: 'expense' },
];

const incomeDescriptions: Record<string, string[]> = {
  Salary: ['Monthly Salary - TechCorp', 'Salary Credit', 'Monthly Compensation'],
  Freelance: ['UI Design Project - Acme', 'Web Dev - StartupXYZ', 'Logo Design - BrandCo', 'Consulting - FinServ'],
  Investment: ['Mutual Fund Dividend', 'Stock Dividend - HDFC', 'FD Interest Credit'],
};

const expenseDescriptions: Record<string, string[]> = {
  Food: ['Swiggy Order', 'Zomato Delivery', 'BigBasket Groceries', 'Cafe Coffee Day', 'Dominos Pizza', 'Fresh Vegetables Market'],
  Transport: ['Uber Ride', 'Ola Auto', 'Metro Card Recharge', 'Petrol - HP', 'Rapido Bike'],
  Shopping: ['Amazon Purchase', 'Flipkart Order', 'Myntra Fashion', 'Decathlon Sports', 'IKEA Home'],
  Bills: ['Electricity Bill - BESCOM', 'Mobile Recharge - Jio', 'WiFi Bill - ACT', 'Gas Connection'],
  Entertainment: ['Netflix Subscription', 'Spotify Premium', 'Movie Tickets - PVR', 'YouTube Premium', 'Gaming - Steam'],
  Health: ['Apollo Pharmacy', 'Gym Membership', 'Doctor Consultation', 'Lab Test - Thyrocare'],
  Education: ['Udemy Course', 'Book Purchase - Amazon', 'Coursera Subscription'],
  Travel: ['Flight Ticket - IndiGo', 'Hotel Booking - OYO', 'Train Ticket - IRCTC'],
  Utilities: ['Water Bill', 'Society Maintenance', 'Parking Charges'],
};

function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];

  // Generate salary for each month
  months.forEach(month => {
    transactions.push({
      id: randomId(),
      date: `${month}-01`,
      description: 'Monthly Salary - TechCorp',
      amount: randomAmount(85000, 95000),
      category: 'Salary',
      type: 'income',
    });
  });

  // Generate freelance income (sporadic)
  for (let i = 0; i < 8; i++) {
    const month = randomFromArray(months);
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    transactions.push({
      id: randomId(),
      date: `${month}-${day}`,
      description: randomFromArray(incomeDescriptions.Freelance),
      amount: randomAmount(15000, 45000),
      category: 'Freelance',
      type: 'income',
    });
  }

  // Generate investment income
  for (let i = 0; i < 5; i++) {
    const month = randomFromArray(months);
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    transactions.push({
      id: randomId(),
      date: `${month}-${day}`,
      description: randomFromArray(incomeDescriptions.Investment),
      amount: randomAmount(2000, 12000),
      category: 'Investment',
      type: 'income',
    });
  }

  // Generate expenses
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const expenseCounts: Record<string, [number, number, number]> = {
    Food: [6, 200, 3500],
    Transport: [5, 100, 2000],
    Shopping: [3, 500, 8000],
    Bills: [2, 500, 5000],
    Entertainment: [3, 199, 1500],
    Health: [2, 300, 5000],
    Education: [1, 500, 3000],
    Travel: [1, 2000, 15000],
    Utilities: [2, 500, 3000],
  };

  months.forEach(month => {
    expenseCategories.forEach(cat => {
      const [count, min, max] = expenseCounts[cat.name] || [2, 200, 2000];
      const actualCount = Math.max(1, count + Math.floor(Math.random() * 3) - 1);
      for (let i = 0; i < actualCount; i++) {
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const descs = expenseDescriptions[cat.name] || ['General Expense'];
        transactions.push({
          id: randomId(),
          date: `${month}-${day}`,
          description: randomFromArray(descs),
          amount: randomAmount(min, max),
          category: cat.name,
          type: 'expense',
        });
      }
    });
  });

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

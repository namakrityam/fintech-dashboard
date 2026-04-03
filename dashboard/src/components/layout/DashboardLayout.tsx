import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { useStore } from '@/store/useStore';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { sidebarOpen, theme } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex min-h-screen flex-col"
      >
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </motion.div>
    </div>
  );
}

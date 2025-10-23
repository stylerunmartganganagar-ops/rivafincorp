import { ReactNode } from 'react';
import DashboardHeader from './DashboardHeader';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  kycStatus?: 'incomplete' | 'submitted' | 'pending' | 'approved' | 'rejected';
}

export default function DashboardLayout({ children, activeTab, onTabChange, kycStatus }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader kycStatus={kycStatus} />

      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

        <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 pt-16 lg:pt-20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

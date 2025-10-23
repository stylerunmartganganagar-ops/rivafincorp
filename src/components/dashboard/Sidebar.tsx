import { LayoutDashboard, CreditCard, Wallet, BarChart3, Settings, Users, FileText, HelpCircle, RotateCcw, AlertTriangle, Send, Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, path: '/transactions' },
    { id: 'refunds', label: 'Refunds', icon: RotateCcw, path: '/refunds' },
    { id: 'disputes', label: 'Disputes', icon: AlertTriangle, path: '/disputes' },
    { id: 'settlements', label: 'Settlements', icon: Wallet, path: '/settlements' },
    { id: 'payment-links', label: 'Payment Links', icon: Link, path: '/payment-links' },
    { id: 'payouts', label: 'Payouts', icon: Send, path: '/payouts' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'customers', label: 'Customers', icon: Users, path: '/customers' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, path: '/help' }
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    onTabChange(item.id);
    navigate(item.path);
  };

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0].replace(/[._]/g, ' ');
    }
    return 'User';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-foreground">PayGateway</h1>
          <p className="text-sm text-sidebar-foreground/60">Merchant Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  activeTab === item.id 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
                onClick={() => handleNavigation(item)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">{getInitials(getDisplayName())}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">{getDisplayName()}</p>
              <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

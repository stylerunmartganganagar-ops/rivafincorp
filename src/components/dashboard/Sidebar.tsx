import { useState } from 'react';
import { LayoutDashboard, CreditCard, Wallet, BarChart3, Settings, Users, FileText, HelpCircle, RotateCcw, AlertTriangle, Send, Link, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    setIsMobileOpen(false);
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
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:bg-sidebar lg:border-r lg:border-sidebar-border lg:flex lg:flex-col">
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
                    'w-full justify-start h-10',
                    activeTab === item.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                  onClick={() => handleNavigation(item)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <span className="truncate">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">{getInitials(getDisplayName())}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{getDisplayName()}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="bg-background shadow-md">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            forceMount
            className="w-72 p-0 max-h-screen overflow-y-auto bg-sidebar text-sidebar-foreground border-sidebar-border data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left"
          >
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
                        'w-full justify-start h-12',
                        activeTab === item.id
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                      )}
                      onClick={() => handleNavigation(item)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">{getInitials(getDisplayName())}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{getDisplayName()}</p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Bell, User, Settings, Shield, LogOut, FileText, Eye, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardHeader({ kycStatus }: { kycStatus?: 'incomplete' | 'submitted' | 'pending' | 'approved' | 'rejected' }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [derivedKyc, setDerivedKyc] = useState<'incomplete' | 'submitted' | 'pending' | 'approved' | 'rejected'>(kycStatus || 'incomplete');

  // If no prop provided, fetch latest from DB
  useEffect(() => {
    const fetchLatestKyc = async () => {
      // Prefer prop if provided
      if (kycStatus !== undefined && kycStatus !== null) {
        setDerivedKyc(kycStatus);
        return;
      }

      // Resolve the authenticated Supabase user id to avoid mismatches
      const { data: authUser } = await supabase.auth.getUser();
      const authUserId = authUser?.user?.id;

      // If no auth user, default to incomplete
      if (!authUserId) {
        setDerivedKyc('incomplete');
        return;
      }

      const { data, error } = await supabase
        .from('kyc_applications')
        .select('status')
        .eq('user_id', authUserId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data?.status) {
        setDerivedKyc(data.status as any);
      } else {
        setDerivedKyc('incomplete');
      }
    };
    fetchLatestKyc();
  }, [kycStatus]);

  // Live update from app (Index.tsx dispatches 'kyc-status-changed')
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as 'incomplete' | 'submitted' | 'pending' | 'approved' | 'rejected';
      if (detail) setDerivedKyc(detail);
    };
    window.addEventListener('kyc-status-changed', handler as EventListener);
    return () => window.removeEventListener('kyc-status-changed', handler as EventListener);
  }, []);

  const getKycStatusColor = (status: string) => {
    const colors = {
      approved: 'bg-success text-success-foreground',
      pending: 'bg-warning text-warning-foreground',
      rejected: 'bg-destructive text-destructive-foreground',
      incomplete: 'bg-muted text-muted-foreground',
      submitted: 'bg-blue-500 text-blue-500-foreground'
    };
    return colors[status as keyof typeof colors] || colors.incomplete;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  return (
    <header className="w-full border-b bg-background">
      <div className="relative flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Brand - Centered on mobile */}
        <div className="flex items-center gap-2 md:justify-start justify-center flex-1 md:flex-none">
          <img
            src="/riva-logo-png_seeklogo-437465-removebg-preview.png"
            alt="Riva Logo"
            className="h-6 w-6 md:h-8 md:w-8 object-contain"
          />
          <span className="font-bold text-lg md:text-xl">Rivafincorp</span>
          <Badge variant="outline" className="ml-2 hidden sm:inline-flex">Dashboard</Badge>
        </div>

        {/* Profile Dropdown - Right side */}
        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payment products, settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {getInitials(getDisplayName())}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={`text-xs ${getKycStatusColor(derivedKyc)}`}>
                      KYC: {derivedKyc}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* My Profile */}
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>

              {/* KYC Documents */}
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <FileText className="mr-2 h-4 w-4" />
                <span>KYC Documents</span>
                <Badge variant="outline" className={`ml-auto text-xs ${getKycStatusColor(derivedKyc)}`}>
                  {derivedKyc}
                </Badge>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Settings Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>General</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Security</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>API Keys</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Webhooks</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              {(user?.user_metadata?.role === 'admin' || user?.email === 'admin@rivafincorp.com') && (
                <DropdownMenuSeparator />
              )}
              {(user?.user_metadata?.role === 'admin' || user?.email === 'admin@rivafincorp.com') && (
                <DropdownMenuItem onClick={() => navigate('/admin/kyc')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />

              {/* Activity Log */}
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Eye className="mr-2 h-4 w-4" />
                <span>Activity Log</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

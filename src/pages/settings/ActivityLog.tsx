import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Search, Filter, Shield, CreditCard, Settings, AlertTriangle, User, Key } from 'lucide-react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ActivityLog {
  id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at: string;
}

interface LoginHistory {
  id: string;
  ip_address: string;
  user_agent?: string;
  location?: string;
  device_type?: string;
  successful: boolean;
  failure_reason?: string;
  created_at: string;
}

const ACTIVITY_TYPES = [
  { value: 'all', label: 'All Activities' },
  { value: 'payment', label: 'Payments' },
  { value: 'refund', label: 'Refunds' },
  { value: 'settlement', label: 'Settlements' },
  { value: 'payout', label: 'Payouts' },
  { value: 'kyc', label: 'KYC' },
  { value: 'security', label: 'Security' },
  { value: 'api', label: 'API' },
  { value: 'webhook', label: 'Webhooks' },
];

export default function ActivityLog() {
  const [activeTab, setActiveTab] = useState('activity');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('7');

  useEffect(() => {
    loadActivityLogs();
    loadLoginHistory();
  }, [filterType, dateRange]);

  const loadActivityLogs = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id);

      // Apply date filter
      const days = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      query = query.gte('created_at', startDate.toISOString());

      // Apply type filter
      if (filterType !== 'all') {
        query = query.ilike('action', `%${filterType}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error) {
        setActivityLogs(data || []);
      }
    } catch (error) {
      console.error('Error loading activity logs:', error);
      toast.error('Failed to load activity logs');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLoginHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const days = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error) {
        setLoginHistory(data || []);
      }
    } catch (error) {
      console.error('Error loading login history:', error);
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('payment')) return <CreditCard className="h-4 w-4" />;
    if (action.includes('refund')) return <CreditCard className="h-4 w-4" />;
    if (action.includes('settlement')) return <CreditCard className="h-4 w-4" />;
    if (action.includes('payout')) return <CreditCard className="h-4 w-4" />;
    if (action.includes('kyc')) return <User className="h-4 w-4" />;
    if (action.includes('password') || action.includes('login')) return <Shield className="h-4 w-4" />;
    if (action.includes('api')) return <Key className="h-4 w-4" />;
    if (action.includes('webhook')) return <Settings className="h-4 w-4" />;
    return <Eye className="h-4 w-4" />;
  };

  const getActivityColor = (action: string) => {
    if (action.includes('failed') || action.includes('rejected')) return 'text-red-600 bg-red-50';
    if (action.includes('created') || action.includes('success')) return 'text-green-600 bg-green-50';
    if (action.includes('updated') || action.includes('changed')) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      case 'desktop': return '💻';
      default: return '🖥️';
    }
  };

  const getLoginStatusColor = (successful: boolean) => {
    return successful
      ? 'text-green-600 bg-green-50'
      : 'text-red-600 bg-red-50';
  };

  const filteredActivityLogs = activityLogs.filter(log =>
    searchTerm === '' ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SettingsLayout activeTab="activity">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24h</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="activity" className="space-y-6">
          {/* Activity Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
              <CardDescription>
                Recent actions and changes to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredActivityLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activities found</p>
                  <p className="text-sm">Try adjusting your filters or check back later</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActivityIcon(log.action)}
                            <Badge variant="outline" className={getActivityColor(log.action)}>
                              {log.action.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm">{log.description}</p>
                          {log.resource_type && log.resource_id && (
                            <p className="text-xs text-muted-foreground">
                              {log.resource_type}: {log.resource_id}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.ip_address || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {activityLogs.filter(l => l.action.includes('payment')).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Payment Actions</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {activityLogs.filter(l => l.action.includes('settlement')).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Settlements</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {activityLogs.filter(l => l.action.includes('kyc')).length}
                  </div>
                  <p className="text-sm text-muted-foreground">KYC Actions</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {activityLogs.filter(l => l.action.includes('security')).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Security Events</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Login History */}
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Monitor login attempts and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No login history available</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginHistory.map((login) => (
                      <TableRow key={login.id}>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getLoginStatusColor(login.successful)}
                          >
                            {login.successful ? 'Success' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getDeviceIcon(login.device_type)}</span>
                            <span className="text-sm">
                              {login.device_type || 'Unknown'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {login.location || <span className="text-muted-foreground">Unknown</span>}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {login.ip_address}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(login.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Security Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Enable Two-Factor Authentication:</strong> Add an extra layer of security to your account with 2FA.
                </AlertDescription>
              </Alert>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <strong>Use Strong Passwords:</strong> Ensure your password is at least 12 characters long with mixed case, numbers, and symbols.
                </AlertDescription>
              </Alert>

              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <strong>Monitor Login Activity:</strong> Regularly review your login history for suspicious activity.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Failed Login Attempts */}
          {loginHistory.filter(l => !l.successful).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Recent Failed Login Attempts</CardTitle>
                <CardDescription>
                  Review potentially suspicious login attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {loginHistory
                    .filter(l => !l.successful)
                    .slice(0, 5)
                    .map((login) => (
                      <div key={login.id} className="flex items-center justify-between p-3 border border-red-200 rounded">
                        <div>
                          <p className="font-medium text-red-800">
                            Failed login from {login.ip_address}
                          </p>
                          <p className="text-sm text-red-600">
                            {login.location} • {new Date(login.created_at).toLocaleString()}
                          </p>
                          {login.failure_reason && (
                            <p className="text-xs text-red-500 mt-1">
                              Reason: {login.failure_reason}
                            </p>
                          )}
                        </div>
                        <Badge variant="destructive">Failed</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </SettingsLayout>
  );
}

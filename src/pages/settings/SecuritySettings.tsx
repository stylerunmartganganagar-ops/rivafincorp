import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Key, Clock, MapPin, Smartphone, AlertTriangle, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SecuritySettings {
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  two_factor_backup_codes?: string[];
  session_timeout: number;
  ip_whitelist?: string[];
  login_alerts: boolean;
  last_login_at?: string;
  last_login_ip?: string;
}

interface LoginHistory {
  id: string;
  ip_address: string;
  user_agent: string;
  location?: string;
  device_type?: string;
  successful: boolean;
  failure_reason?: string;
  created_at: string;
}

export default function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    two_factor_enabled: false,
    session_timeout: 30,
    login_alerts: true,
  });
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadSettings();
    loadLoginHistory();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
    }
  };

  const loadLoginHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error) {
        setLoginHistory(data || []);
      }
    } catch (error) {
      console.error('Error loading login history:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Security settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save security settings');
    } finally {
      setIsLoading(false);
    }
  };

  const enableTwoFactor = async () => {
    // In a real implementation, this would integrate with an authenticator app
    // For now, we'll simulate enabling 2FA
    const newBackupCodes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );

    setSettings(prev => ({
      ...prev,
      two_factor_enabled: true,
      two_factor_backup_codes: newBackupCodes,
    }));

    setBackupCodes(newBackupCodes);
    toast.success('Two-factor authentication enabled!');

    // Save to database
    await saveSettings();
  };

  const disableTwoFactor = async () => {
    setSettings(prev => ({
      ...prev,
      two_factor_enabled: false,
      two_factor_secret: undefined,
      two_factor_backup_codes: undefined,
    }));

    toast.success('Two-factor authentication disabled');
    await saveSettings();
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Log the password change
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action: 'password_changed',
          description: 'User changed their password',
          metadata: { timestamp: new Date().toISOString() }
        });
      }

      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      case 'desktop': return '💻';
      default: return '🖥️';
    }
  };

  const getStatusColor = (successful: boolean) => {
    return successful
      ? 'text-green-600 bg-green-50'
      : 'text-red-600 bg-red-50';
  };

  return (
    <SettingsLayout activeTab="security">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General Security</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="history">Login History</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Secure your account with authenticator app
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {settings.two_factor_enabled && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  )}
                  <Switch
                    checked={settings.two_factor_enabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        enableTwoFactor();
                      } else {
                        disableTwoFactor();
                      }
                    }}
                  />
                </div>
              </div>

              {settings.two_factor_enabled && backupCodes.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Save your backup codes!</p>
                      <p className="text-sm">
                        These codes can be used to access your account if you lose your authenticator device.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowBackupCodes(!showBackupCodes)}
                        >
                          {showBackupCodes ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                          {showBackupCodes ? 'Hide' : 'Show'} Codes
                        </Button>
                        <Button variant="outline" size="sm">
                          Download Codes
                        </Button>
                      </div>
                      {showBackupCodes && (
                        <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-muted rounded font-mono text-sm">
                          {backupCodes.map((code, index) => (
                            <div key={index}>{code}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Session Management
              </CardTitle>
              <CardDescription>
                Control how long sessions remain active
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select
                  value={settings.session_timeout.toString()}
                  onValueChange={(value) =>
                    setSettings(prev => ({ ...prev, session_timeout: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How long before you're automatically logged out due to inactivity
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified of new login attempts
                  </p>
                </div>
                <Switch
                  checked={settings.login_alerts}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, login_alerts: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={isLoading}>
              <Shield className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Security Settings'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button onClick={changePassword} disabled={isLoading} className="w-full">
                <Key className="h-4 w-4 mr-2" />
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices and browsers currently logged into your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💻</div>
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome on Windows • {settings.last_login_ip || 'Unknown IP'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Current</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Login History */}
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Recent login attempts and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No login history available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loginHistory.map((login) => (
                    <div key={login.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">
                          {getDeviceIcon(login.device_type)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(login.successful)}
                            >
                              {login.successful ? (
                                <><CheckCircle className="h-3 w-3 mr-1" /> Success</>
                              ) : (
                                <><XCircle className="h-3 w-3 mr-1" /> Failed</>
                              )}
                            </Badge>
                            <span className="font-medium">{login.ip_address}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {login.location && <MapPin className="h-3 w-3 inline mr-1" />}
                            {login.location || 'Unknown location'} • {new Date(login.created_at).toLocaleString()}
                          </p>
                          {login.failure_reason && (
                            <p className="text-sm text-red-600">
                              {login.failure_reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsLayout>
  );
}

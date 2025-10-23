import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { isTestUser } from '@/data/userUtils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface UserSettings {
  business_name?: string;
  business_type?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  account_holder_name?: string;
  enabled_payment_methods?: string[];
  settlement_frequency?: 'daily' | 'weekly' | 'monthly';
  settlement_time?: string;
  webhook_url?: string;
  webhook_secret?: string;
  webhook_events?: string[];
  api_version?: string;
  rate_limiting_enabled?: boolean;
  rate_limit_per_minute?: number;
}

interface NotificationSettings {
  email_notifications?: boolean;
  sms_notifications?: boolean;
  payment_alerts?: boolean;
  settlement_alerts?: boolean;
  security_alerts?: boolean;
  marketing_emails?: boolean;
  webhook_url?: string;
  webhook_secret?: string;
}

interface SecuritySettings {
  two_factor_enabled?: boolean;
  two_factor_secret?: string;
  two_factor_backup_codes?: string[];
  session_timeout?: number;
  ip_whitelist?: string[];
  login_alerts?: boolean;
  password_changed_at?: string;
  last_login_at?: string;
  last_login_ip?: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state
  const [businessSettings, setBusinessSettings] = useState<UserSettings>({
    business_name: '',
    business_type: '',
    business_email: '',
    business_phone: '',
    business_address: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    enabled_payment_methods: ['upi', 'card', 'net_banking'],
    settlement_frequency: 'daily',
    settlement_time: '18:00',
    webhook_url: '',
    webhook_secret: '',
    webhook_events: ['payment_success', 'payment_failed', 'refund'],
    api_version: 'v1',
    rate_limiting_enabled: true,
    rate_limit_per_minute: 100
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications: true,
    sms_notifications: false,
    payment_alerts: true,
    settlement_alerts: true,
    security_alerts: true,
    marketing_emails: false,
    webhook_url: '',
    webhook_secret: ''
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    two_factor_enabled: false,
    two_factor_secret: '',
    two_factor_backup_codes: [],
    session_timeout: 30,
    ip_whitelist: [],
    login_alerts: true,
    password_changed_at: '',
    last_login_at: '',
    last_login_ip: ''
  });

  // Load settings from database on mount
  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load user settings
      const { data: userSettings, error: userError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!userError && userSettings) {
        setBusinessSettings(prev => ({
          ...prev,
          ...userSettings,
          enabled_payment_methods: userSettings.enabled_payment_methods || prev.enabled_payment_methods,
          webhook_events: userSettings.webhook_events || prev.webhook_events
        }));
      }

      // Load notification settings
      const { data: notifSettings, error: notifError } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!notifError && notifSettings) {
        setNotificationSettings(prev => ({
          ...prev,
          ...notifSettings
        }));
      }

      // Load security settings
      const { data: secSettings, error: secError } = await supabase
        .from('security_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!secError && secSettings) {
        setSecuritySettings(prev => ({
          ...prev,
          ...secSettings
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...businessSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Settings Saved',
        description: 'Your business settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Error saving business settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save business settings.',
        variant: 'destructive'
      });
    }
  };

  const handleNotificationSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          ...notificationSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Settings Saved',
        description: 'Your notification settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification settings.',
        variant: 'destructive'
      });
    }
  };

  const handleSecuritySave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: user.id,
          ...securitySettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Settings Saved',
        description: 'Your security settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save security settings.',
        variant: 'destructive'
      });
    }
  };

  // Check if current user is test user for dummy data
  const showDummyData = isTestUser(user?.email);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading settings...</span>
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={businessSettings.business_name || ''}
                          onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_name: e.target.value }))}
                          placeholder="Enter your business name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type</Label>
                        <Input
                          id="businessType"
                          value={businessSettings.business_type || ''}
                          onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_type: e.target.value }))}
                          placeholder="Enter your business type"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessSettings.business_email || ''}
                        onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_email: e.target.value }))}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={businessSettings.business_phone || ''}
                        onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_phone: e.target.value }))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Input
                        id="address"
                        value={businessSettings.business_address || ''}
                        onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_address: e.target.value }))}
                        placeholder="Enter your business address"
                      />
                    </div>
                    <Button onClick={handleBusinessSave}>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bank Account Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={businessSettings.bank_name || ''}
                        onChange={(e) => setBusinessSettings(prev => ({ ...prev, bank_name: e.target.value }))}
                        placeholder="Enter your bank name"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={businessSettings.account_number || ''}
                          onChange={(e) => setBusinessSettings(prev => ({ ...prev, account_number: e.target.value }))}
                          placeholder="Enter your account number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifsc">IFSC Code</Label>
                        <Input
                          id="ifsc"
                          value={businessSettings.ifsc_code || ''}
                          onChange={(e) => setBusinessSettings(prev => ({ ...prev, ifsc_code: e.target.value }))}
                          placeholder="Enter IFSC code"
                        />
                      </div>
                    </div>
                    <Button onClick={handleBusinessSave}>Update Bank Details</Button>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading settings...</span>
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">UPI Payments</p>
                        <p className="text-sm text-muted-foreground">Accept payments via UPI</p>
                      </div>
                      <Switch
                        checked={businessSettings.enabled_payment_methods?.includes('upi') || false}
                        onCheckedChange={(checked) => {
                          const methods = businessSettings.enabled_payment_methods || [];
                          if (checked) {
                            setBusinessSettings(prev => ({
                              ...prev,
                              enabled_payment_methods: [...methods, 'upi']
                            }));
                          } else {
                            setBusinessSettings(prev => ({
                              ...prev,
                              enabled_payment_methods: methods.filter(m => m !== 'upi')
                            }));
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">Credit/Debit Cards</p>
                        <p className="text-sm text-muted-foreground">Accept card payments</p>
                      </div>
                      <Switch
                        checked={businessSettings.enabled_payment_methods?.includes('card') || false}
                        onCheckedChange={(checked) => {
                          const methods = businessSettings.enabled_payment_methods || [];
                          if (checked) {
                            setBusinessSettings(prev => ({
                              ...prev,
                              enabled_payment_methods: [...methods, 'card']
                            }));
                          } else {
                            setBusinessSettings(prev => ({
                              ...prev,
                              enabled_payment_methods: methods.filter(m => m !== 'card')
                            }));
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">Net Banking</p>
                        <p className="text-sm text-muted-foreground">Accept net banking payments</p>
                      </div>
                      <Switch
                        checked={businessSettings.enabled_payment_methods?.includes('net_banking') || false}
                        onCheckedChange={(checked) => {
                          const methods = businessSettings.enabled_payment_methods || [];
                          if (checked) {
                            setBusinessSettings(prev => ({
                              ...prev,
                              enabled_payment_methods: [...methods, 'net_banking']
                            }));
                          } else {
                            setBusinessSettings(prev => ({
                              ...prev,
                              enabled_payment_methods: methods.filter(m => m !== 'net_banking')
                            }));
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">Wallets</p>
                        <p className="text-sm text-muted-foreground">Accept wallet payments</p>
                      </div>
                      <Switch
                        checked={businessSettings.enabled_payment_methods?.includes('wallet') || false}
                        onCheckedChange={(checked) => {
                          const methods = businessSettings.enabled_payment_methods || [];
                          if (checked) {
                            setBusinessSettings(prev => ({
                              ...prev,
                              enabled_payment_methods: [...methods, 'wallet']
                            }));
                          } else {
                            setBusinessSettings(prev => ({
                              ...prev,
                              enabled_payment_methods: methods.filter(m => m !== 'wallet')
                            }));
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Settlement Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Settlement Frequency</Label>
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="frequency"
                            id="daily"
                            checked={businessSettings.settlement_frequency === 'daily'}
                            onChange={() => setBusinessSettings(prev => ({ ...prev, settlement_frequency: 'daily' }))}
                          />
                          <Label htmlFor="daily" className="font-normal cursor-pointer">Daily</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="frequency"
                            id="weekly"
                            checked={businessSettings.settlement_frequency === 'weekly'}
                            onChange={() => setBusinessSettings(prev => ({ ...prev, settlement_frequency: 'weekly' }))}
                          />
                          <Label htmlFor="weekly" className="font-normal cursor-pointer">Weekly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="frequency"
                            id="monthly"
                            checked={businessSettings.settlement_frequency === 'monthly'}
                            onChange={() => setBusinessSettings(prev => ({ ...prev, settlement_frequency: 'monthly' }))}
                          />
                          <Label htmlFor="monthly" className="font-normal cursor-pointer">Monthly</Label>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleBusinessSave}>Save Preferences</Button>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading settings...</span>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Transaction Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified for every transaction</p>
                    </div>
                    <Switch
                      checked={notificationSettings.payment_alerts || false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, payment_alerts: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Settlement Updates</p>
                      <p className="text-sm text-muted-foreground">Notifications for settlements</p>
                    </div>
                    <Switch
                      checked={notificationSettings.settlement_alerts || false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, settlement_alerts: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Failed Transactions</p>
                      <p className="text-sm text-muted-foreground">Alerts for failed payments</p>
                    </div>
                    <Switch
                      checked={notificationSettings.security_alerts || false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, security_alerts: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Weekly Reports</p>
                      <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketing_emails || false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketing_emails: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      value={notificationSettings.webhook_url || ''}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
                      placeholder="https://your-webhook-url.com"
                    />
                  </div>
                  <Button onClick={handleNotificationSave}>Save Notification Settings</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading settings...</span>
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Password & Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                      </div>
                      <Switch
                        checked={securitySettings.two_factor_enabled || false}
                        onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, two_factor_enabled: checked }))}
                      />
                    </div>
                    <Button variant="outline">Setup 2FA</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.session_timeout || 30}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) || 30 }))}
                        placeholder="30"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Login Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                      </div>
                      <Switch
                        checked={securitySettings.login_alerts || false}
                        onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, login_alerts: checked }))}
                      />
                    </div>
                    <Button onClick={handleSecuritySave}>Save Security Settings</Button>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );

};

export default Settings;

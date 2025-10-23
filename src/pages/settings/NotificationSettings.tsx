import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, MessageSquare, Webhook, Save, TestTube, AlertCircle } from 'lucide-react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  payment_alerts: boolean;
  settlement_alerts: boolean;
  security_alerts: boolean;
  marketing_emails: boolean;
  webhook_url?: string;
  webhook_secret?: string;
}

interface WebhookLog {
  id: string;
  event_type: string;
  status: string;
  attempts: number;
  created_at: string;
  response_code?: number;
  error_message?: string;
}

export default function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    sms_notifications: false,
    payment_alerts: true,
    settlement_alerts: true,
    security_alerts: true,
    marketing_emails: false,
  });
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  useEffect(() => {
    loadSettings();
    loadWebhookLogs();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const loadWebhookLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error) {
        setWebhookLogs(data || []);
      }
    } catch (error) {
      console.error('Error loading webhook logs:', error);
    }
  };

  const saveSettings = async () => {
    if (!settings.webhook_url && settings.email_notifications) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Notification settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!settings.webhook_url) {
      toast.error('Please enter a webhook URL first');
      return;
    }

    setIsTestingWebhook(true);
    try {
      const testPayload = {
        event: 'test',
        timestamp: new Date().toISOString(),
        data: { message: 'This is a test webhook' }
      };

      const response = await fetch(settings.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': settings.webhook_secret || '',
          'User-Agent': 'Rivafincorp-Webhook/1.0'
        },
        body: JSON.stringify(testPayload)
      });

      // Log the test
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('webhook_logs').insert({
          user_id: user.id,
          event_type: 'test',
          payload: testPayload,
          status: response.ok ? 'sent' : 'failed',
          attempts: 1,
          response_code: response.status,
          error_message: response.ok ? null : `HTTP ${response.status}`
        });
      }

      if (response.ok) {
        toast.success('Webhook test successful!');
      } else {
        toast.error(`Webhook test failed: HTTP ${response.status}`);
      }

      await loadWebhookLogs(); // Refresh logs
    } catch (error) {
      console.error('Webhook test error:', error);
      toast.error('Webhook test failed - network error');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'retry': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <SettingsLayout activeTab="notifications">
      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Choose what emails you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about successful payments and refunds
                  </p>
                </div>
                <Switch
                  checked={settings.payment_alerts}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, payment_alerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Settlement Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when settlements are processed
                  </p>
                </div>
                <Switch
                  checked={settings.settlement_alerts}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, settlement_alerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Important security notifications and login alerts
                  </p>
                </div>
                <Switch
                  checked={settings.security_alerts}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, security_alerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Product updates, tips, and promotional content
                  </p>
                </div>
                <Switch
                  checked={settings.marketing_emails}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, marketing_emails: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Notifications
              </CardTitle>
              <CardDescription>
                SMS alerts for critical events (additional charges may apply)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive SMS alerts for high-priority events
                  </p>
                </div>
                <Switch
                  checked={settings.sms_notifications}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, sms_notifications: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          {/* Webhook Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Configure webhooks to receive real-time notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://yourapp.com/webhook"
                  value={settings.webhook_url || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  We'll send POST requests to this URL for payment events
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Webhook Secret (Optional)</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  placeholder="Your webhook secret"
                  value={settings.webhook_secret || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, webhook_secret: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Used to verify webhook authenticity
                </p>
              </div>

              <Separator />

              <div className="flex items-center gap-4">
                <Button onClick={testWebhook} disabled={isTestingWebhook}>
                  <TestTube className="h-4 w-4 mr-2" />
                  {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
                </Button>
                <Button onClick={saveSettings} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Events */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Events</CardTitle>
              <CardDescription>
                Events that will trigger webhook notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Payment Events</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• payment.succeeded</li>
                    <li>• payment.failed</li>
                    <li>• payment.refunded</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Settlement Events</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• settlement.created</li>
                    <li>• settlement.completed</li>
                    <li>• settlement.failed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          {/* Webhook Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Webhook Delivery Logs</CardTitle>
              <CardDescription>
                Recent webhook delivery attempts and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {webhookLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No webhook logs yet</p>
                  <p className="text-sm">Configure a webhook URL to start receiving events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {webhookLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                          <span className="font-medium">{log.event_type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                        {log.error_message && (
                          <div className="flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            {log.error_message}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Attempt {log.attempts}
                        </div>
                        {log.response_code && (
                          <div className="text-xs text-muted-foreground">
                            HTTP {log.response_code}
                          </div>
                        )}
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

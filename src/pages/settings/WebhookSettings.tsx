import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Webhook, TestTube, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface WebhookLog {
  id: string;
  event_type: string;
  status: string;
  attempts: number;
  last_attempt_at: string;
  next_retry_at?: string;
  error_message?: string;
  response_code?: number;
  payload: any;
  created_at: string;
}

interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  is_active: boolean;
}

const AVAILABLE_EVENTS = [
  { value: 'payment.succeeded', label: 'Payment Succeeded', description: 'When a payment is successfully processed' },
  { value: 'payment.failed', label: 'Payment Failed', description: 'When a payment attempt fails' },
  { value: 'payment.refunded', label: 'Payment Refunded', description: 'When a payment is refunded' },
  { value: 'settlement.created', label: 'Settlement Created', description: 'When a new settlement is initiated' },
  { value: 'settlement.completed', label: 'Settlement Completed', description: 'When a settlement is processed' },
  { value: 'dispute.created', label: 'Dispute Created', description: 'When a new dispute is raised' },
  { value: 'dispute.resolved', label: 'Dispute Resolved', description: 'When a dispute is resolved' },
];

export default function WebhookSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [config, setConfig] = useState<WebhookConfig>({
    url: '',
    secret: '',
    events: [],
    is_active: false,
  });
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadWebhookConfig();
    loadWebhookLogs();
  }, []);

  const loadWebhookConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_settings')
        .select('webhook_url, webhook_secret')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setConfig(prev => ({
          ...prev,
          url: data.webhook_url || '',
          secret: data.webhook_secret || '',
          is_active: !!(data.webhook_url && data.webhook_url.trim()),
        }));
      }
    } catch (error) {
      console.error('Error loading webhook config:', error);
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
        .limit(50);

      if (!error) {
        setWebhookLogs(data || []);
      }
    } catch (error) {
      console.error('Error loading webhook logs:', error);
      toast.error('Failed to load webhook logs');
    }
  };

  const saveWebhookConfig = async () => {
    if (!config.url.trim()) {
      toast.error('Please enter a webhook URL');
      return;
    }

    if (config.events.length === 0) {
      toast.error('Please select at least one event');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          webhook_url: config.url.trim(),
          webhook_secret: config.secret.trim() || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Webhook configuration saved successfully');
      setConfig(prev => ({ ...prev, is_active: true }));
    } catch (error) {
      console.error('Error saving webhook config:', error);
      toast.error('Failed to save webhook configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!config.url.trim()) {
      toast.error('Please enter a webhook URL to test');
      return;
    }

    setIsTesting(true);
    try {
      const testPayload = {
        event: 'test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook from Rivafincorp',
          test: true,
          source: 'dashboard'
        }
      };

      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': config.secret || '',
          'User-Agent': 'Rivafincorp-Webhook-Test/1.0'
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
          error_message: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`
        });
      }

      if (response.ok) {
        toast.success('Webhook test successful!');
      } else {
        toast.error(`Webhook test failed: HTTP ${response.status}`);
      }

      await loadWebhookLogs();
    } catch (error) {
      console.error('Webhook test error:', error);
      toast.error('Webhook test failed - network error');
    } finally {
      setIsTesting(false);
    }
  };

  const regenerateSecret = () => {
    const newSecret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setConfig(prev => ({ ...prev, secret: newSecret }));
    toast.success('New webhook secret generated');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'retry': return <RefreshCw className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
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
    <SettingsLayout activeTab="webhooks">
      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6">
          {/* Webhook URL Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Endpoint
              </CardTitle>
              <CardDescription>
                Configure your webhook endpoint to receive real-time notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://yourapp.com/webhooks/rivafincorp"
                  value={config.url}
                  onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  We'll send POST requests to this URL when events occur
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <Button variant="outline" size="sm" onClick={regenerateSecret}>
                    Regenerate
                  </Button>
                </div>
                <Input
                  id="webhook-secret"
                  type="password"
                  placeholder="Auto-generated secret for verification"
                  value={config.secret}
                  onChange={(e) => setConfig(prev => ({ ...prev, secret: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Used to verify webhook authenticity. Keep this secret!
                </p>
              </div>

              <Separator />

              <div className="flex items-center gap-4">
                <Button onClick={testWebhook} disabled={isTesting}>
                  <TestTube className="h-4 w-4 mr-2" />
                  {isTesting ? 'Testing...' : 'Test Webhook'}
                </Button>
                <Button onClick={saveWebhookConfig} disabled={isLoading}>
                  <Webhook className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security & Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Security & Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Webhook Security</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Always verify the webhook secret in your endpoint</li>
                      <li>• Use HTTPS URLs only</li>
                      <li>• Implement idempotency to handle duplicate events</li>
                      <li>• Respond with 200 status code within 10 seconds</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Headers Sent</h4>
                  <div className="bg-muted p-3 rounded font-mono text-xs">
                    <div>Content-Type: application/json</div>
                    <div>X-Webhook-Secret: [your-secret]</div>
                    <div>User-Agent: Rivafincorp-Webhook/1.0</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Response Expectations</h4>
                  <div className="bg-muted p-3 rounded text-xs">
                    <div>• HTTP 200-299: Success</div>
                    <div>• HTTP 400-499: Permanent failure</div>
                    <div>• HTTP 500+: Will retry</div>
                    <div>• Timeout: 10 seconds</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Event Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Event Subscriptions</CardTitle>
              <CardDescription>
                Choose which events you want to receive webhooks for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {AVAILABLE_EVENTS.map((event) => (
                  <div key={event.value} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id={event.value}
                      checked={config.events.includes(event.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfig(prev => ({ ...prev, events: [...prev.events, event.value] }));
                        } else {
                          setConfig(prev => ({
                            ...prev,
                            events: prev.events.filter(e => e !== event.value)
                          }));
                        }
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={event.value} className="font-medium cursor-pointer">
                        {event.label}
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
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
                Monitor webhook delivery attempts and responses
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attempts</TableHead>
                      <TableHead>Response</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhookLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.event_type}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <Badge variant="outline" className={getStatusColor(log.status)}>
                              {log.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{log.attempts}</TableCell>
                        <TableCell>
                          {log.response_code ? (
                            <Badge variant={log.response_code >= 200 && log.response_code < 300 ? "default" : "destructive"}>
                              {log.response_code}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Retry Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Retry Policy</CardTitle>
              <CardDescription>
                How we handle webhook delivery failures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Immediate Retry</h4>
                  <p>Failed webhooks are retried immediately</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Exponential Backoff</h4>
                  <p>Subsequent retries use increasing delays</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Final Failure</h4>
                  <p>After 5 attempts, delivery is marked as failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsLayout>
  );
}

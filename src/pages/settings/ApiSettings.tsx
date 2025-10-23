import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  permissions: string[];
  is_active: boolean;
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
}

const PERMISSION_OPTIONS = [
  { value: 'read_payments', label: 'Read Payments' },
  { value: 'create_payments', label: 'Create Payments' },
  { value: 'refund_payments', label: 'Refund Payments' },
  { value: 'read_settlements', label: 'Read Settlements' },
  { value: 'create_payouts', label: 'Create Payouts' },
  { value: 'read_webhooks', label: 'Read Webhooks' },
  { value: 'manage_webhooks', label: 'Manage Webhooks' },
];

export default function ApiSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expiresIn, setExpiresIn] = useState('never');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showGeneratedKey, setShowGeneratedKey] = useState(false);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setApiKeys(data || []);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast.error('Failed to load API keys');
    }
  };

  const generateApiKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'rk_live_'; // Rivafincorp live key prefix
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const apiKey = generateApiKey();
      const hashedKey = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(apiKey));
      const keyHash = Array.from(new Uint8Array(hashedKey))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      let expiresAt: string | null = null;
      if (expiresIn !== 'never') {
        const days = parseInt(expiresIn);
        expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      }

      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: newKeyName.trim(),
          key_hash: keyHash,
          permissions: selectedPermissions,
          expires_at: expiresAt,
        });

      if (error) throw error;

      setGeneratedKey(apiKey);
      setShowGeneratedKey(true);
      toast.success('API key created successfully');

      // Reset form
      setNewKeyName('');
      setSelectedPermissions([]);
      setExpiresIn('never');
      setShowCreateDialog(false);

      await loadApiKeys();
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApiKey = async (keyId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: isActive })
        .eq('id', keyId);

      if (error) throw error;

      toast.success(`API key ${isActive ? 'activated' : 'deactivated'}`);
      await loadApiKeys();
    } catch (error) {
      console.error('Error toggling API key:', error);
      toast.error('Failed to update API key');
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      toast.success('API key deleted successfully');
      await loadApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getPermissionLabel = (permission: string) => {
    return PERMISSION_OPTIONS.find(p => p.value === permission)?.label || permission;
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <SettingsLayout activeTab="api">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">API Keys</h2>
            <p className="text-muted-foreground">
              Manage API keys for programmatic access to your account
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Generate a new API key with specific permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production App"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                    {PERMISSION_OPTIONS.map((perm) => (
                      <label key={perm.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions(prev => [...prev, perm.value]);
                            } else {
                              setSelectedPermissions(prev => prev.filter(p => p !== perm.value));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Expires In</Label>
                  <Select value={expiresIn} onValueChange={setExpiresIn}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createApiKey} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Key'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Generated Key Dialog */}
        <Dialog open={showGeneratedKey} onOpenChange={setShowGeneratedKey}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Key Generated</DialogTitle>
              <DialogDescription>
                Copy this key now - it won't be shown again!
              </DialogDescription>
            </DialogHeader>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Store this key securely. It provides access to your account and cannot be recovered if lost.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded font-mono text-sm">
                <span className="flex-1">{generatedKey}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generatedKey!)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => setShowGeneratedKey(false)} className="w-full">
                I have copied the key
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* API Keys Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>
              Manage your existing API keys and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No API keys yet</p>
                <p className="text-sm">Create your first API key to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {key.permissions.slice(0, 2).map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {getPermissionLabel(perm)}
                            </Badge>
                          ))}
                          {key.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{key.permissions.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isExpired(key.expires_at) ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : key.is_active ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {key.last_used_at ? (
                          <span className="text-sm">
                            {new Date(key.last_used_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {key.expires_at ? (
                          <span className="text-sm">
                            {new Date(key.expires_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleApiKey(key.id, !key.is_active)}
                            disabled={isExpired(key.expires_at)}
                          >
                            {key.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteApiKey(key.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              Learn how to integrate with our API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Getting Started</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Authentication with API keys</li>
                  <li>• Rate limiting (1000 requests/hour)</li>
                  <li>• JSON request/response format</li>
                  <li>• HTTPS only</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Base URL</h4>
                <code className="text-sm bg-muted p-2 rounded block">
                  https://api.rivafincorp.com/v1
                </code>
                <p className="text-xs text-muted-foreground">
                  Use this base URL for all API requests
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}

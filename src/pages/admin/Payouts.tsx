import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PayoutRecord {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  ifsc_code: string;
  account_type: 'savings' | 'current';
  fee: number;
  net_amount: number;
  notes: string | null;
  requested_at: string;
  processed_at: string | null;
  reference_id: string | null;
  user_email?: string;
  user_name?: string;
}

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      
      // Fetch payouts with user information
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          *,
          users:user_id (
            email,
            name
          )
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const transformedData = data.map((p: any) => ({
          ...p,
          user_email: p.users?.email,
          user_name: p.users?.name
        }));
        setPayouts(transformedData);
      }
    } catch (error) {
      console.error('Error loading payouts:', error);
      toast.error('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  const updatePayoutStatus = async (payoutId: string, newStatus: 'processing' | 'completed' | 'failed' | 'cancelled') => {
    try {
      const updateData: any = {
        status: newStatus,
        processed_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('payouts')
        .update(updateData)
        .eq('id', payoutId);

      if (error) throw error;

      toast.success(`Payout ${newStatus}`);
      loadPayouts();
    } catch (error) {
      console.error('Error updating payout:', error);
      toast.error('Failed to update payout status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-success/10 text-success border-success/20',
      processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20',
      cancelled: 'bg-muted text-muted-foreground border-border'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const filteredPayouts = statusFilter === 'all' 
    ? payouts 
    : payouts.filter(p => p.status === statusFilter);

  const stats = {
    total: payouts.length,
    pending: payouts.filter(p => p.status === 'pending').length,
    processing: payouts.filter(p => p.status === 'processing').length,
    completed: payouts.filter(p => p.status === 'completed').length,
    totalAmount: payouts.reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payout Requests</h1>
        <p className="text-muted-foreground">Manage and process user payout requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              ₹{(stats.totalAmount / 100).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              ₹{(stats.pendingAmount / 100).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading payouts...</div>
          ) : filteredPayouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No payout requests found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Bank Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payout.user_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{payout.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payout.bank_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {payout.account_holder_name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {payout.account_number} • {payout.ifsc_code}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{(payout.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      ₹{(payout.fee / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold text-success">
                      ₹{(payout.net_amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(payout.status)}>
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(payout.requested_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {payout.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updatePayoutStatus(payout.id, 'processing')}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Process
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updatePayoutStatus(payout.id, 'completed')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updatePayoutStatus(payout.id, 'failed')}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {payout.status === 'processing' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePayoutStatus(payout.id, 'completed')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

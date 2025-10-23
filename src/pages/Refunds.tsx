import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Download, Filter, Eye } from 'lucide-react';
import { mockTransactions, mockRefunds } from '@/data/mockData';
import { isTestUser, emptyRefunds } from '@/data/userUtils';
import { Refund, Transaction } from '@/types/payment';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface RefundFormData {
  transactionId: string;
  amount: string;
  reason: string;
  refundMethod: 'original' | 'bank_transfer' | 'wallet';
}

export default function Refunds() {
  const [activeTab, setActiveTab] = useState('refunds');
  const [refunds, setRefunds] = useState<Refund[]>(mockRefunds);
  const { user } = useAuth();

  useEffect(() => {
    // Check if current user is test user
    const showMockData = isTestUser(user?.email);
    setRefunds(showMockData ? mockRefunds : emptyRefunds);
  }, [user]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<RefundFormData>({
    transactionId: '',
    amount: '',
    reason: '',
    refundMethod: 'original'
  });

  const getStatusColor = (status: Refund['status']) => {
    const colors = {
      completed: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors[status];
  };

  const getTransactionById = (id: string): Transaction | undefined => {
    return mockTransactions.find(txn => txn.id === id);
  };

  const handleRefundSubmit = () => {
    if (!formData.transactionId || !formData.amount || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transaction = getTransactionById(formData.transactionId);
    if (!transaction) {
      toast.error('Transaction not found');
      return;
    }

    const refundAmount = parseFloat(formData.amount);
    if (refundAmount > transaction.amount / 100) {
      toast.error('Refund amount cannot exceed transaction amount');
      return;
    }

    const newRefund: Refund = {
      id: `ref_${Date.now()}`,
      transactionId: formData.transactionId,
      amount: refundAmount * 100,
      currency: 'INR',
      status: 'pending',
      reason: formData.reason,
      requestedBy: 'merchant',
      requestedAt: new Date(),
      refundMethod: formData.refundMethod,
    };

    setRefunds([newRefund, ...refunds]);
    setIsDialogOpen(false);
    setFormData({ transactionId: '', amount: '', reason: '', refundMethod: 'original' });
    toast.success('Refund request initiated successfully');
  };

  const successfulTransactions = mockTransactions.filter(txn => txn.status === 'success');

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Refunds</h2>
            <p className="text-muted-foreground">
              Manage and process refund requests
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Refund
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Initiate Refund</DialogTitle>
                  <DialogDescription>
                    Create a new refund request for a successful transaction.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="transaction">Transaction</Label>
                    <Select
                      value={formData.transactionId}
                      onValueChange={(value) => {
                        const txn = getTransactionById(value);
                        if (txn) {
                          setFormData(prev => ({
                            ...prev,
                            transactionId: value,
                            amount: (txn.amount / 100).toString()
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a transaction" />
                      </SelectTrigger>
                      <SelectContent>
                        {successfulTransactions.map((txn) => (
                          <SelectItem key={txn.id} value={txn.id}>
                            {txn.id} - ₹{(txn.amount / 100).toFixed(2)} ({txn.customer})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Refund Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter refund amount"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="method">Refund Method</Label>
                    <Select
                      value={formData.refundMethod}
                      onValueChange={(value: 'original' | 'bank_transfer' | 'wallet') =>
                        setFormData(prev => ({ ...prev, refundMethod: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original Payment Method</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Enter reason for refund"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRefundSubmit}>
                    Initiate Refund
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(refunds.reduce((sum, r) => sum + r.amount, 0) / 100).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{refunds.length} refund requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(refunds.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0) / 100).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {refunds.filter(r => r.status === 'pending').length} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(refunds.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0) / 100).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {refunds.filter(r => r.status === 'completed').length} completed
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Refund History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Refund ID</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refunds.map((refund) => {
                  const transaction = getTransactionById(refund.transactionId);
                  return (
                    <TableRow key={refund.id}>
                      <TableCell className="font-mono text-sm">{refund.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{refund.transactionId}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction ? format(transaction.date, 'MMM dd, yyyy') : 'N/A'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{transaction?.customer || 'N/A'}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{(refund.amount / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(refund.status)}>
                          {refund.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{refund.refundMethod.replace('_', ' ')}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(refund.requestedAt, 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

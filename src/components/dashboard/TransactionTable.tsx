import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Transaction } from '@/types/payment';
import { Download, Filter, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundMethod, setRefundMethod] = useState<'original' | 'bank_transfer' | 'wallet'>('original');

  const getStatusColor = (status: Transaction['status']) => {
    const colors = {
      success: 'bg-success/10 text-success border-success/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      refunded: 'bg-muted text-muted-foreground border-border'
    };
    return colors[status];
  };

  const handleRefundClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRefundAmount((transaction.amount / 100).toString());
    setRefundReason('');
    setRefundMethod('original');
    setIsRefundDialogOpen(true);
  };

  const handleRefundSubmit = () => {
    if (!selectedTransaction || !refundAmount || !refundReason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(refundAmount);
    if (amount > selectedTransaction.amount / 100) {
      toast.error('Refund amount cannot exceed transaction amount');
      return;
    }

    if (amount <= 0) {
      toast.error('Refund amount must be greater than 0');
      return;
    }

    // In a real app, this would submit to an API
    toast.success(`Refund of ₹${amount.toFixed(2)} initiated for ${selectedTransaction.id}`);
    setIsRefundDialogOpen(false);
    setSelectedTransaction(null);
    setRefundAmount('');
    setRefundReason('');
    setRefundMethod('original');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{txn.customer}</p>
                      <p className="text-sm text-muted-foreground">{txn.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{txn.method}</TableCell>
                  <TableCell className="font-semibold">
                    ₹{(txn.amount / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(txn.status)}>
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(txn.date, 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="font-semibold text-success">
                    ₹{(txn.net / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {txn.status === 'success' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefundClick(txn)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {transactions.map((txn) => (
            <Card key={txn.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">{txn.id}</p>
                    <p className="font-medium">{txn.customer}</p>
                    <p className="text-sm text-muted-foreground">{txn.email}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(txn.status)}>
                    {txn.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Method</p>
                    <p className="font-medium">{txn.method}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{format(txn.date, 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-semibold">₹{(txn.amount / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net Amount</p>
                    <p className="font-semibold text-success">₹{(txn.net / 100).toFixed(2)}</p>
                  </div>
                </div>

                {txn.status === 'success' && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleRefundClick(txn)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Initiate Refund
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Initiate Refund</DialogTitle>
            <DialogDescription>
              Create a refund for transaction {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Transaction Details</Label>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm"><strong>Customer:</strong> {selectedTransaction.customer}</p>
                  <p className="text-sm"><strong>Amount:</strong> ₹{(selectedTransaction.amount / 100).toFixed(2)}</p>
                  <p className="text-sm"><strong>Date:</strong> {format(selectedTransaction.date, 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="refundAmount">Refund Amount (₹)</Label>
                <input
                  id="refundAmount"
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter refund amount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  max={selectedTransaction.amount / 100}
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum: ₹{(selectedTransaction.amount / 100).toFixed(2)}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="refundMethod">Refund Method</Label>
                <Select
                  value={refundMethod}
                  onValueChange={(value: 'original' | 'bank_transfer' | 'wallet') =>
                    setRefundMethod(value)
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
                <Label htmlFor="refundReason">Reason for Refund</Label>
                <Textarea
                  id="refundReason"
                  placeholder="Enter reason for refund"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRefundSubmit}>
              Initiate Refund
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

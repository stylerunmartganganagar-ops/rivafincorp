import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockTransactions } from '@/data/mockData';
import { isTestUser, emptyTransactions } from '@/data/userUtils';
import { Download, Filter, Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer: string;
  email: string;
  method: string;
  date: Date;
  orderId: string;
  fee: number;
  tax: number;
  net: number;
}

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      // Check if current user is test user
      const showMockData = isTestUser(currentUser.email);

      if (showMockData) {
        // Show mock data for test user
        setTransactions(mockTransactions);
        setIsLoading(false);
        return;
      }

      // For non-test users, show empty data (no database queries needed)
      setTransactions(emptyTransactions);
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions(emptyTransactions);
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = [
        'Transaction ID',
        'Order ID',
        'Customer Name',
        'Customer Email',
        'Payment Method',
        'Amount',
        'Fee',
        'Tax',
        'Net Amount',
        'Status',
        'Date',
        'Currency'
      ];

      const csvData = transactions.map(txn => [
        txn.id,
        txn.orderId,
        txn.customer,
        txn.email,
        txn.method,
        (txn.amount / 100).toFixed(2),
        (txn.fee / 100).toFixed(2),
        (txn.tax / 100).toFixed(2),
        (txn.net / 100).toFixed(2),
        txn.status,
        format(txn.date, 'yyyy-MM-dd HH:mm:ss'),
        txn.currency
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${transactions.length} transactions successfully`);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredTransactions = transactions.filter(txn =>
    searchTerm === '' ||
    txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'bg-success/10 text-success border-success/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      refunded: 'bg-muted text-muted-foreground border-border'
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Successful</p>
              <p className="text-2xl font-bold text-success">
                {transactions.filter(t => t.status === 'success').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Failed</p>
              <p className="text-2xl font-bold text-destructive">
                {transactions.filter(t => t.status === 'failed').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-warning">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Transactions</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  disabled={isExporting || transactions.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading transactions...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                        <TableCell className="font-mono text-sm">{txn.orderId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{txn.customer}</p>
                            <p className="text-xs text-muted-foreground">{txn.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{txn.method}</TableCell>
                        <TableCell className="font-semibold">₹{(txn.amount / 100).toFixed(2)}</TableCell>
                        <TableCell className="text-muted-foreground">₹{(txn.fee / 100).toFixed(2)}</TableCell>
                        <TableCell className="font-semibold text-success">₹{(txn.net / 100).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(txn.status)}>
                            {txn.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{format(txn.date, 'MMM dd, HH:mm')}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;

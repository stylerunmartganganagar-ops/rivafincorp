import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send, Plus, Download, Filter, Eye, Building2 } from 'lucide-react';
import { Payout, PayoutRequest, BankDetails, SupportedBanks } from '@/types/payment';
import { mockSupportedBanks } from '@/data/mockData';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface PayoutFormData {
  amount: string;
  bankCategory: string;
  bankId: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  notes: string;
  // Manual bank entry fields
  manualBankName: string;
  isManualEntry: boolean;
}

export default function Payouts() {
  const [activeTab, setActiveTab] = useState('payouts');
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [supportedBanks, setSupportedBanks] = useState<SupportedBanks>({});
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingPayouts, setLoadingPayouts] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number>(0); // in paise
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    // Always load from database for all users
    loadBanksFromDatabase();
    loadPayoutsFromDatabase();
    loadUserBalance();
  }, [user]);

  const loadPayoutsFromDatabase = async () => {
    if (!user?.id) {
      setLoadingPayouts(false);
      return;
    }

    try {
      setLoadingPayouts(true);
      const { data: payoutsData, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('Error loading payouts:', error);
        setPayouts([]);
        return;
      }

      if (payoutsData) {
        // Transform database format to UI format
        const transformedPayouts: Payout[] = payoutsData.map(p => ({
          id: p.id,
          amount: p.amount,
          currency: p.currency,
          status: p.status as Payout['status'],
          bankDetails: {
            accountNumber: p.account_number,
            accountHolderName: p.account_holder_name,
            bankName: p.bank_name,
            ifscCode: p.ifsc_code,
            accountType: p.account_type as 'savings' | 'current'
          },
          requestedAt: new Date(p.requested_at),
          processedAt: p.processed_at ? new Date(p.processed_at) : undefined,
          referenceId: p.reference_id || undefined,
          fee: p.fee || undefined,
          netAmount: p.net_amount || undefined
        }));

        setPayouts(transformedPayouts);
      } else {
        setPayouts([]);
      }
    } catch (error) {
      console.error('Error loading payouts:', error);
      setPayouts([]);
    } finally {
      setLoadingPayouts(false);
    }
  };

  const loadUserBalance = async () => {
    if (!user?.id) {
      setWalletBalance(0);
      setLoadingBalance(false);
      return;
    }

    try {
      setLoadingBalance(true);
      const { data, error } = await supabase
        .from('users')
        .select('balance, hold_amount')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading wallet balance:', error);
        setWalletBalance(0);
        return;
      }

      if (data) {
        const available = Math.max(0, (data.balance || 0) - (data.hold_amount || 0));
        setWalletBalance(available);
      } else {
        setWalletBalance(0);
      }
    } catch (e) {
      console.error('Error loading wallet balance:', e);
      setWalletBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };

  const loadBanksFromDatabase = async () => {
    try {
      setLoadingBanks(true);
      const { data: banks, error } = await supabase
        .from('supported_banks')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      if (banks) {
        // Group banks by category
        const groupedBanks: SupportedBanks = {};
        banks.forEach(bank => {
          if (!groupedBanks[bank.category]) {
            groupedBanks[bank.category] = [];
          }
          groupedBanks[bank.category].push({
            id: bank.id,
            name: bank.name,
            ifscPrefix: bank.ifsc_prefix || bank.id.substring(0, 4).toUpperCase()
          });
        });

        // Always include "Other Banks" category for manual entry
        groupedBanks['Other Banks'] = [];

        setSupportedBanks(groupedBanks);
      }
    } catch (error) {
      console.error('Error loading banks:', error);
      // Fallback to mock data
      const fallbackBanks = { ...mockSupportedBanks, 'Other Banks': [] };
      setSupportedBanks(fallbackBanks);
    } finally {
      setLoadingBanks(false);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PayoutFormData>({
    amount: '',
    bankCategory: '',
    bankId: '',
    accountNumber: '',
    accountHolderName: '',
    ifscCode: '',
    accountType: 'current',
    notes: '',
    manualBankName: '',
    isManualEntry: false
  });

  const getStatusColor = (status: Payout['status']) => {
    const colors = {
      completed: 'bg-success/10 text-success border-success/20',
      processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20',
      cancelled: 'bg-muted text-muted-foreground border-border'
    };
    return colors[status];
  };

  const handleBankSelection = (category: string, bankId: string) => {
    const selectedBank = Object.values(supportedBanks)
      .flat()
      .find(bank => bank.id === bankId);

    if (selectedBank) {
      setFormData(prev => ({
        ...prev,
        bankCategory: category,
        bankId,
        ifscCode: selectedBank.ifscPrefix + '0000000', // Generate IFSC with bank prefix
        isManualEntry: false,
        manualBankName: ''
      }));
    }
  };

  const handleCategoryChange = (category: string) => {
    const isManual = category === 'Other Banks';
    setFormData(prev => ({
      ...prev,
      bankCategory: category,
      bankId: '',
      ifscCode: '',
      isManualEntry: isManual,
      manualBankName: ''
    }));
  };

  const handlePayoutSubmit = async () => {
    // Validation for manual entry
    if (formData.isManualEntry && !formData.manualBankName) {
      toast.error('Please enter bank name');
      return;
    }

    // Validation for predefined bank selection
    if (!formData.isManualEntry && !formData.bankId) {
      toast.error('Please select a bank');
      return;
    }

    if (!formData.amount || !formData.accountNumber || !formData.accountHolderName || !formData.ifscCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount < 100) {
      toast.error('Minimum payout amount is ₹100');
      return;
    }

    // Balance check (amount is in INR, walletBalance in paise)
    const requestedPaise = Math.round(amount * 100);
    if (requestedPaise > walletBalance) {
      toast.error('Not enough funds available in wallet');
      return;
    }

    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    let bankName: string;

    if (formData.isManualEntry) {
      bankName = formData.manualBankName;
    } else {
      const selectedBank = Object.values(supportedBanks)
        .flat()
        .find(bank => bank.id === formData.bankId);
      
      if (!selectedBank) {
        toast.error('Please select a bank');
        return;
      }
      bankName = selectedBank.name;
    }

    const payoutId = `po_${Date.now()}`;
    const referenceId = `PO_REF_${Date.now()}`;
    const fee = Math.max(100, amount * 0.001 * 100); // 0.1% fee or min ₹100 (in paise)
    const netAmount = (amount * 100) - fee;

    try {
      // Save to database
      const { error } = await supabase
        .from('payouts')
        .insert({
          id: payoutId,
          user_id: user.id,
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          status: 'pending',
          bank_name: bankName,
          account_number: formData.accountNumber,
          account_holder_name: formData.accountHolderName,
          ifsc_code: formData.ifscCode,
          account_type: formData.accountType,
          fee: fee,
          net_amount: netAmount,
          notes: formData.notes || null,
          reference_id: referenceId,
          requested_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving payout:', error);
        toast.error('Failed to submit payout request');
        return;
      }

      // Create local payout object for immediate UI update
      const newPayout: Payout = {
        id: payoutId,
        amount: amount * 100,
        currency: 'INR',
        status: 'pending',
        bankDetails: {
          accountNumber: formData.accountNumber,
          accountHolderName: formData.accountHolderName,
          bankName: bankName,
          ifscCode: formData.ifscCode,
          accountType: formData.accountType as 'savings' | 'current'
        },
        requestedAt: new Date(),
        referenceId: referenceId,
        fee: fee,
        netAmount: netAmount
      };

      setPayouts([newPayout, ...payouts]);
      setIsDialogOpen(false);
      setFormData({
        amount: '',
        bankCategory: '',
        bankId: '',
        accountNumber: '',
        accountHolderName: '',
        ifscCode: '',
        accountType: 'current',
        notes: '',
        manualBankName: '',
        isManualEntry: false
      });
      toast.success('Payout request submitted successfully');
      // Refresh balance after creating payout
      loadUserBalance();
    } catch (error) {
      console.error('Error submitting payout:', error);
      toast.error('Failed to submit payout request');
    }
  };

  const totalPending = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalProcessing = payouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Payouts</h2>
                <p className="text-muted-foreground">
                  Request payouts to your bank account
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
                      New Payout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Request Payout</DialogTitle>
                      <DialogDescription>
                        Transfer funds to your bank account. Minimum payout: ₹100
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 overflow-y-auto flex-1 px-1">
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={formData.amount}
                          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground">
                          Processing fee: 0.1% (min ₹100)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Available balance: {loadingBalance ? 'Loading…' : `₹${(walletBalance / 100).toLocaleString()}`}
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label>Bank Category</Label>
                        <Select
                          value={formData.bankCategory}
                          onValueChange={handleCategoryChange}
                          disabled={loadingBanks}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={loadingBanks ? "Loading banks..." : "Select bank category"} />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(supportedBanks).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category === 'Other Banks' ? category : `${category} (${supportedBanks[category].length} banks)`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.bankCategory && formData.bankCategory !== 'Other Banks' && (
                        <div className="grid gap-2">
                          <Label>Select Bank</Label>
                          <Select
                            value={formData.bankId}
                            onValueChange={(value) => handleBankSelection(formData.bankCategory, value)}
                            disabled={loadingBanks}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={loadingBanks ? "Loading banks..." : "Select your bank"} />
                            </SelectTrigger>
                            <SelectContent>
                              {supportedBanks[formData.bankCategory]?.map((bank) => (
                                <SelectItem key={bank.id} value={bank.id}>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    {bank.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {formData.bankCategory === 'Other Banks' && (
                        <div className="grid gap-2">
                          <Label htmlFor="manualBankName">Bank Name</Label>
                          <Input
                            id="manualBankName"
                            placeholder="Enter your bank name"
                            value={formData.manualBankName}
                            onChange={(e) => setFormData(prev => ({ ...prev, manualBankName: e.target.value }))}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter details for a bank not listed in our directory
                          </p>
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="Enter account number"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="accountHolder">Account Holder Name</Label>
                        <Input
                          id="accountHolder"
                          placeholder="Enter account holder name"
                          value={formData.accountHolderName}
                          onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          placeholder="Enter IFSC code"
                          value={formData.ifscCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Account Type</Label>
                        <Select
                          value={formData.accountType}
                          onValueChange={(value: 'savings' | 'current') =>
                            setFormData(prev => ({ ...prev, accountType: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="savings">Savings Account</SelectItem>
                            <SelectItem value="current">Current Account</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                          id="notes"
                          placeholder="Add any notes"
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePayoutSubmit}
                        disabled={loadingPayouts || loadingBalance}
                      >
                        Request Payout
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Requested</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(payouts.reduce((sum, p) => sum + p.amount, 0) / 100).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{payouts.length} payout requests</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(totalPending / 100).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {payouts.filter(p => p.status === 'pending').length} pending
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(totalProcessing / 100).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {payouts.filter(p => p.status === 'processing').length} processing
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(totalCompleted / 100).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {payouts.filter(p => p.status === 'completed').length} completed
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Bank Details</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payout.bankDetails.bankName}</p>
                            <p className="text-sm text-muted-foreground">
                              {payout.bankDetails.accountNumber} ({payout.bankDetails.accountType})
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {payout.bankDetails.ifscCode}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{(payout.amount / 100).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          ₹{payout.fee ? (payout.fee / 100).toFixed(2) : '0.00'}
                        </TableCell>
                        <TableCell className="font-semibold text-success">
                          ₹{payout.netAmount ? (payout.netAmount / 100).toFixed(2) : '0.00'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(payout.status)}>
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(payout.requestedAt, 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {payout.referenceId}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
      </div>
    </DashboardLayout>
  );
}

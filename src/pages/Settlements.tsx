import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Download, Calendar, TrendingUp, Wallet, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface SettlementRecord {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'settled' | 'failed';
  transaction_count: number;
  fee: number;
  tax: number;
  net_amount: number;
  utr: string | null;
  settlement_date: string | null;
  created_at: string;
  processed_at: string | null;
  bank_reference: string | null;
}

const Settlements = () => {
  const [activeTab, setActiveTab] = useState('settlements');
  const [settlements, setSettlements] = useState<SettlementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadSettlements();
  }, [user]);

  const loadSettlements = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settlements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading settlements:', error);
        setSettlements([]);
        return;
      }

      if (data) {
        setSettlements(data);
      } else {
        setSettlements([]);
      }
    } catch (error) {
      console.error('Error loading settlements:', error);
      setSettlements([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      settled: 'bg-success/10 text-success border-success/20',
      processing: 'bg-primary/10 text-primary border-primary/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors[status as keyof typeof colors];
  };

  const handleSettleNow = (settlementId: string) => {
    toast({
      title: 'Settlement Initiated',
      description: `Settlement ${settlementId} has been queued for processing.`
    });
  };

  const pendingAmount = settlements.filter(s => s.status === 'pending').reduce((acc, s) => acc + s.amount, 0);

  // Calculate monthly total for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthAmount = settlements
    .filter(s => {
      const settlementDate = s.settlement_date ? new Date(s.settlement_date) : new Date(s.created_at);
      return settlementDate.getMonth() === currentMonth && settlementDate.getFullYear() === currentYear;
    })
    .reduce((acc, s) => acc + s.amount, 0);

  // Get last settlement amount
  const lastSettlement = settlements
    .filter(s => s.status === 'settled')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  const totalSettlementsCount = settlements.length;

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settlements</h2>
          <p className="text-muted-foreground">Manage your payment settlements and payouts</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <p className="text-2xl font-bold text-warning">₹{(pendingAmount / 100).toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">This Month</p>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">₹{(thisMonthAmount / 100).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Last Settlement</p>
                <Wallet className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-success">
                {lastSettlement ? `₹${(lastSettlement.net_amount / 100).toLocaleString()}` : '₹0.00'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Settlements</p>
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <p className="text-2xl font-bold">{totalSettlementsCount}</p>
            </CardContent>
          </Card>
        </div>

        {settlements.filter(s => s.status === 'pending').map(settlement => (
          <Card key={settlement.id} className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Settlement - Ready to Process
                </span>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  Ready
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gross Amount</p>
                  <p className="text-2xl font-bold text-primary">₹{(settlement.amount / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fee + Tax</p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    ₹{((settlement.fee + settlement.tax) / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Amount</p>
                  <p className="text-2xl font-bold text-success">₹{(settlement.net_amount / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{settlement.transaction_count}</p>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handleSettleNow(settlement.id)}
              >
                <Zap className="h-4 w-4 mr-2" />
                Settle Now - Instant Payout
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Settlement History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {settlements.map((settlement) => (
              <div key={settlement.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-mono text-lg font-medium">{settlement.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(settlement.settlement_date ? new Date(settlement.settlement_date) : new Date(settlement.created_at), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(settlement.status)}>
                    {settlement.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gross Amount</p>
                    <p className="text-xl font-semibold">₹{(settlement.amount / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                    <p className="text-xl font-semibold">{settlement.transaction_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Deductions</p>
                    <p className="text-xl font-semibold text-destructive">
                      ₹{((settlement.fee + settlement.tax) / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Net Settled</p>
                    <p className="text-xl font-semibold text-success">₹{(settlement.net_amount / 100).toFixed(2)}</p>
                  </div>
                </div>

                {settlement.utr && (
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">UTR Number: </span>
                      <span className="font-mono font-medium">{settlement.utr}</span>
                    </div>
                    <Button variant="ghost" size="sm">Copy</Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settlements;

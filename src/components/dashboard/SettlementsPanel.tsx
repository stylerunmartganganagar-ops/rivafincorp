import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settlement } from '@/types/payment';
import { Zap, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface SettlementsPanelProps {
  settlements: Settlement[];
}

export function SettlementsPanel({ settlements }: SettlementsPanelProps) {
  const { toast } = useToast();

  const getStatusColor = (status: Settlement['status']) => {
    const colors = {
      settled: 'bg-success/10 text-success border-success/20',
      processing: 'bg-primary/10 text-primary border-primary/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors[status];
  };

  const handleSettleNow = (settlementId: string) => {
    toast({
      title: 'Settlement Initiated',
      description: `Settlement ${settlementId} has been queued for processing.`
    });
  };

  const pendingSettlement = settlements.find(s => s.status === 'pending');

  return (
    <div className="space-y-4">
      {pendingSettlement && (
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Settlement
              </span>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                Ready to Settle
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{(pendingSettlement.amount / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Amount</p>
                <p className="text-2xl font-bold text-success">
                  ₹{(pendingSettlement.net / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg font-semibold">{pendingSettlement.transactionCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fee + Tax</p>
                <p className="text-lg font-semibold">
                  ₹{((pendingSettlement.fee + pendingSettlement.tax) / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => handleSettleNow(pendingSettlement.id)}
            >
              <Zap className="h-4 w-4 mr-2" />
              Settle Now
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Settlement History</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {settlements.map((settlement) => (
            <div key={settlement.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-mono text-sm font-medium">{settlement.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(settlement.date, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(settlement.status)}>
                  {settlement.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-semibold">₹{(settlement.amount / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Transactions</p>
                  <p className="font-semibold">{settlement.transactionCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Net</p>
                  <p className="font-semibold text-success">₹{(settlement.net / 100).toFixed(2)}</p>
                </div>
              </div>

              {settlement.utr && (
                <div className="bg-muted/50 rounded p-2 text-xs">
                  <span className="text-muted-foreground">UTR: </span>
                  <span className="font-mono">{settlement.utr}</span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

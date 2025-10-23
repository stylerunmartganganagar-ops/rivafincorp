import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Plus, Eye, Copy, Share } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { isTestUser } from '@/data/userUtils';
import { useAuth } from '@/hooks/useAuth';

interface PaymentLink {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: 'active' | 'expired' | 'paid';
  createdAt: string;
  url: string;
}

const mockPaymentLinks: PaymentLink[] = [
  {
    id: '1',
    title: 'Invoice for Services',
    description: 'Payment for consulting services',
    amount: 5000,
    currency: 'INR',
    status: 'active',
    createdAt: '2024-01-15',
    url: 'https://pay.rivafincorp.in/link/abc123'
  },
  {
    id: '2',
    title: 'Product Purchase',
    description: 'E-commerce payment link',
    amount: 2500,
    currency: 'INR',
    status: 'paid',
    createdAt: '2024-01-10',
    url: 'https://pay.rivafincorp.in/link/def456'
  }
];

export default function PaymentLinks() {
  const [activeTab, setActiveTab] = useState('payment-links');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(mockPaymentLinks);
  const { user } = useAuth();

  useEffect(() => {
    // Check if current user is test user
    const showMockData = isTestUser(user?.email);
    setPaymentLinks(showMockData ? mockPaymentLinks : []);
  }, [user]);

  const [newLink, setNewLink] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'INR'
  });

  const handleCreateLink = () => {
    const link: PaymentLink = {
      id: Math.random().toString(36).substr(2, 9),
      title: newLink.title,
      description: newLink.description,
      amount: parseFloat(newLink.amount),
      currency: newLink.currency,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      url: `https://pay.rivafincorp.in/link/${Math.random().toString(36).substr(2, 9)}`
    };
    setPaymentLinks([link, ...paymentLinks]);
    setNewLink({ title: '', description: '', amount: '', currency: 'INR' });
    setIsCreateDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary">Active</Badge>;
      case 'paid':
        return <Badge variant="default">Paid</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payment Links</h2>
            <p className="text-muted-foreground">
              Create and manage payment links for your customers.
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Payment Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Payment Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Invoice #123"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Payment description..."
                    value={newLink.description}
                    onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newLink.amount}
                      onChange={(e) => setNewLink({ ...newLink, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={newLink.currency}
                      onChange={(e) => setNewLink({ ...newLink, currency: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLink}>Create Link</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Payment Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{link.title}</div>
                    <div className="text-sm text-muted-foreground">{link.description}</div>
                    <div className="text-sm text-muted-foreground">
                      ₹{link.amount.toLocaleString()} • Created {link.createdAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(link.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

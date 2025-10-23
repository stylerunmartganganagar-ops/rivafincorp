import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, Percent } from 'lucide-react';
import { isTestUser } from '@/data/userUtils';
import { useAuth } from '@/hooks/useAuth';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { user } = useAuth();

  const mockMetrics = [
    { label: 'Revenue Growth', value: '+24.5%', trend: 'up', icon: TrendingUp, color: 'text-success' },
    { label: 'Transaction Volume', value: '+18.2%', trend: 'up', icon: CreditCard, color: 'text-primary' },
    { label: 'Avg Transaction Value', value: '₹1,964', trend: 'up', icon: DollarSign, color: 'text-accent' },
    { label: 'Active Customers', value: '2,458', trend: 'up', icon: Users, color: 'text-warning' },
    { label: 'Success Rate', value: '94.5%', trend: 'up', icon: Percent, color: 'text-success' },
    { label: 'Refund Rate', value: '2.8%', trend: 'down', icon: TrendingDown, color: 'text-destructive' },
  ];

  const mockPaymentMethods = [
    { name: 'UPI', transactions: 458, amount: 689000, percentage: 42 },
    { name: 'Credit Card', transactions: 312, amount: 1248000, percentage: 25 },
    { name: 'Debit Card', transactions: 289, amount: 867000, percentage: 23 },
    { name: 'Net Banking', transactions: 189, amount: 456000, percentage: 10 },
  ];

  const mockTopCustomers = [
    { name: 'Acme Corp', transactions: 45, amount: 450000, email: 'contact@acme.com' },
    { name: 'Tech Solutions', transactions: 38, amount: 380000, email: 'info@techsol.com' },
    { name: 'Global Traders', transactions: 32, amount: 320000, email: 'sales@global.com' },
    { name: 'Digital Hub', transactions: 28, amount: 280000, email: 'admin@dighub.com' },
    { name: 'Innovation Inc', transactions: 24, amount: 240000, email: 'hello@innov.com' },
  ];

  const emptyMetrics = [
    { label: 'Revenue Growth', value: '0%', trend: 'up', icon: TrendingUp, color: 'text-muted-foreground' },
    { label: 'Transaction Volume', value: '0', trend: 'up', icon: CreditCard, color: 'text-muted-foreground' },
    { label: 'Avg Transaction Value', value: '₹0', trend: 'up', icon: DollarSign, color: 'text-muted-foreground' },
    { label: 'Active Customers', value: '0', trend: 'up', icon: Users, color: 'text-muted-foreground' },
    { label: 'Success Rate', value: '0%', trend: 'up', icon: Percent, color: 'text-muted-foreground' },
    { label: 'Refund Rate', value: '0%', trend: 'down', icon: TrendingDown, color: 'text-muted-foreground' },
  ];

  const emptyPaymentMethods = [
    { name: 'UPI', transactions: 0, amount: 0, percentage: 0 },
    { name: 'Credit Card', transactions: 0, amount: 0, percentage: 0 },
    { name: 'Debit Card', transactions: 0, amount: 0, percentage: 0 },
    { name: 'Net Banking', transactions: 0, amount: 0, percentage: 0 },
  ];

  const emptyTopCustomers = [
    { name: 'No data available', transactions: 0, amount: 0, email: '' },
  ];

  const [metrics, setMetrics] = useState(mockMetrics);
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [topCustomers, setTopCustomers] = useState(mockTopCustomers);

  useEffect(() => {
    // Check if current user is test user
    const showMockData = isTestUser(user?.email);
    setMetrics(showMockData ? mockMetrics : emptyMetrics);
    setPaymentMethods(showMockData ? mockPaymentMethods : emptyPaymentMethods);
    setTopCustomers(showMockData ? mockTopCustomers : emptyTopCustomers);
  }, [user]);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Detailed insights and performance metrics</p>
        </div>

          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{metric.value}</p>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">vs last month</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{method.name}</span>
                      <span className="text-muted-foreground">
                        {method.transactions} transactions • ₹{(method.amount / 100).toFixed(0)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={customer.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(customer.amount / 100).toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">{customer.transactions} txns</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {[45000, 52000, 48000, 61000, 58000, 67000, 71000].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(value / 71000) * 100}%` }}
                    />
                    <p className="text-xs text-muted-foreground">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </p>
                    <p className="text-xs font-semibold">₹{(value / 100).toFixed(0)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
    </DashboardLayout>
  );
};

export default Analytics;

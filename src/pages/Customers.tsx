import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Eye, Mail, Phone } from 'lucide-react';
import { isTestUser } from '@/data/userUtils';
import { useAuth } from '@/hooks/useAuth';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalTransactions: number;
  totalSpent: number;
  lastTransaction: string;
  status: 'active' | 'inactive';
}

const mockCustomers: Customer[] = [
  {
    id: 'cust_001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    totalTransactions: 45,
    totalSpent: 675000,
    lastTransaction: '2 hours ago',
    status: 'active'
  },
  {
    id: 'cust_002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 98765 43211',
    totalTransactions: 38,
    totalSpent: 570000,
    lastTransaction: '1 day ago',
    status: 'active'
  },
  {
    id: 'cust_003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+91 98765 43212',
    totalTransactions: 32,
    totalSpent: 480000,
    lastTransaction: '3 days ago',
    status: 'active'
  },
  {
    id: 'cust_004',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '+91 98765 43213',
    totalTransactions: 28,
    totalSpent: 420000,
    lastTransaction: '1 week ago',
    status: 'inactive'
  },
  {
    id: 'cust_005',
    name: 'Robert Brown',
    email: 'robert@example.com',
    phone: '+91 98765 43214',
    totalTransactions: 24,
    totalSpent: 360000,
    lastTransaction: '2 weeks ago',
    status: 'active'
  }
];

const Customers = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Check if current user is test user
    const showMockData = isTestUser(user?.email);
    setCustomers(showMockData ? mockCustomers : []);
  }, [user]);

  const filteredCustomers = customers.filter(customer =>
    searchTerm === '' ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage and view all your customers</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
              <p className="text-xs text-success mt-1">+{customers.length > 0 ? Math.floor(customers.length * 0.05) : 0} this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Active Customers</p>
              <p className="text-2xl font-bold text-success">
                {customers.filter(c => c.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {customers.length > 0 ? Math.round((customers.filter(c => c.status === 'active').length / customers.length) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Avg. Customer Value</p>
              <p className="text-2xl font-bold text-primary">
                ₹{customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length / 100) : 0}
              </p>
              <p className="text-xs text-success mt-1">+{customers.length > 0 ? Math.floor(Math.random() * 20) : 0}% vs last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Repeat Rate</p>
              <p className="text-2xl font-bold text-accent">
                {customers.length > 0 ? Math.round((customers.filter(c => c.totalTransactions > 1).length / customers.length) * 100) : 0}%
              </p>
              <p className="text-xs text-success mt-1">+{customers.length > 0 ? Math.floor(Math.random() * 10) : 0}% improvement</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customer List</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Transaction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{customer.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{customer.totalTransactions}</TableCell>
                      <TableCell className="font-semibold text-success">
                        ₹{(customer.totalSpent / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {customer.lastTransaction}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={customer.status === 'active'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-muted text-muted-foreground border-border'
                          }
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Customers;

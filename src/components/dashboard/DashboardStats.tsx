import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, CreditCard, DollarSign, Activity } from 'lucide-react';
import { DashboardStats as Stats } from '@/types/payment';

interface DashboardStatsProps {
  stats: Stats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 100000).toFixed(2)}L`,
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toLocaleString(),
      change: '+8.2%',
      isPositive: true,
      icon: CreditCard,
      color: 'text-accent'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      change: '+2.1%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-success'
    },
    {
      title: 'Pending Settlements',
      value: `₹${(stats.pendingSettlements / 1000).toFixed(1)}K`,
      change: '-5.3%',
      isPositive: false,
      icon: Activity,
      color: 'text-warning'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stat.value}</p>
              <div className="flex items-center text-xs">
                {stat.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                )}
                <span className={stat.isPositive ? 'text-success' : 'text-destructive'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

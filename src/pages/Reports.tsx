import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar, TrendingUp } from 'lucide-react';
import { isTestUser } from '@/data/userUtils';
import { useAuth } from '@/hooks/useAuth';

interface Report {
  name: string;
  description: string;
  frequency: string;
  lastGenerated: string;
  format: string;
  status: 'ready' | 'generating' | 'failed';
}

interface ScheduledReport {
  name: string;
  schedule: string;
  format: string;
}

const mockReports: Report[] = [
  {
    name: 'Transaction Summary Report',
    description: 'Detailed breakdown of all transactions',
    frequency: 'Daily',
    lastGenerated: '2 hours ago',
    format: 'CSV, PDF',
    status: 'ready'
  },
  {
    name: 'Settlement Report',
    description: 'Complete settlement and payout details',
    frequency: 'Weekly',
    lastGenerated: '1 day ago',
    format: 'Excel, PDF',
    status: 'ready'
  },
  {
    name: 'Revenue Analytics Report',
    description: 'Comprehensive revenue analysis and trends',
    frequency: 'Monthly',
    lastGenerated: '3 days ago',
    format: 'PDF',
    status: 'ready'
  },
  {
    name: 'Customer Behavior Report',
    description: 'Customer insights and purchasing patterns',
    frequency: 'Monthly',
    lastGenerated: '5 days ago',
    format: 'Excel',
    status: 'ready'
  },
  {
    name: 'Payment Method Analysis',
    description: 'Distribution and performance of payment methods',
    frequency: 'Weekly',
    lastGenerated: '1 week ago',
    format: 'CSV, PDF',
    status: 'generating'
  },
  {
    name: 'Risk Assessment Report',
    description: 'Fraud and risk analysis for transactions',
    frequency: 'Quarterly',
    lastGenerated: '2 weeks ago',
    format: 'PDF',
    status: 'ready'
  }
];

const mockScheduledReports: ScheduledReport[] = [
  { name: 'Daily Transaction Summary', schedule: 'Every day at 11:59 PM', format: 'CSV' },
  { name: 'Weekly Settlement Report', schedule: 'Every Monday at 9:00 AM', format: 'PDF' },
  { name: 'Monthly Revenue Report', schedule: '1st of every month', format: 'Excel' },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(mockScheduledReports);
  const { user } = useAuth();

  useEffect(() => {
    // Check if current user is test user
    const showMockData = isTestUser(user?.email);
    setReports(showMockData ? mockReports : []);
    setScheduledReports(showMockData ? mockScheduledReports : []);
  }, [user]);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Generate and download comprehensive business reports</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{reports.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">This Month</p>
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <p className="text-2xl font-bold">{Math.floor(reports.length * 0.7)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-bold">{scheduledReports.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Downloads</p>
                <Download className="h-4 w-4 text-warning" />
              </div>
              <p className="text-2xl font-bold">{reports.length > 0 ? reports.length * 8 : 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {reports.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No reports available
                </div>
              ) : (
                reports.map((report, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{report.name}</h3>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={report.status === 'ready'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{report.frequency}</span>
                        </div>
                        <div>
                          <span>Last: {report.lastGenerated}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-muted-foreground">
                          Format: {report.format}
                        </span>
                        <Button size="sm" disabled={report.status === 'generating'}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No scheduled reports
                </div>
              ) : (
                scheduledReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">{report.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{report.format}</Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;

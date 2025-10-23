import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAdminStats, recentAdminActivity } from "@/data/adminMock";
import { UserCheck, UserX, Clock, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const stats = mockAdminStats;

  const getKycStatusColor = (status: string) => {
    const colors = {
      approved: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20',
      incomplete: 'bg-muted text-muted-foreground border-border'
    };
    return colors[status as keyof typeof colors] || colors.incomplete;
  };

  const getKycStatusIcon = (status: string) => {
    const icons = {
      approved: UserCheck,
      pending: Clock,
      rejected: UserX,
      incomplete: AlertCircle
    };
    return icons[status as keyof typeof icons] || AlertCircle;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Admin Overview</h2>

      {/* KYC Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingKyc}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedKyc}</div>
            <p className="text-xs text-muted-foreground">Verified users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejectedKyc}</div>
            <p className="text-xs text-muted-foreground">Need resubmission</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incomplete KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers - stats.approvedKyc - stats.pendingKyc - stats.rejectedKyc}</div>
            <p className="text-xs text-muted-foreground">No documents</p>
          </CardContent>
        </Card>
      </div>

      {/* General Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Holds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeHolds}</div>
            <p className="text-xs text-muted-foreground">Funds on hold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flagged Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.flaggedAccounts}</div>
            <p className="text-xs text-muted-foreground">Risk indicators</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.pendingSettlementVolume/100).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Volume pending</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAdminActivity.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <div className="font-medium">{a.action}</div>
                <div className="text-muted-foreground">{new Date(a.at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

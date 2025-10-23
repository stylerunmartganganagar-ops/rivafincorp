import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminUsers, mockAdminStats } from "@/data/adminMock";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserCheck, UserX, Clock, AlertCircle } from "lucide-react";

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const list = useMemo(() => adminUsers.filter(u => (
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase()) ||
    u.id.toLowerCase().includes(q.toLowerCase())
  )), [q]);

  const quickRestrict = (id: string) => {
    toast.success(`Restricted user ${id} (mock)`);
  };

  const quickHold = (id: string) => {
    toast.warning(`Placed funds hold on ${id} (mock)`);
  };

  const quickApproveKyc = (id: string) => {
    toast.success(`Approved KYC for user ${id} (mock)`);
  };

  const quickRejectKyc = (id: string) => {
    toast.error(`Rejected KYC for user ${id} (mock)`);
  };

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
        <div className="w-64"><Input placeholder="Search by name, email, id" value={q} onChange={e=>setQ(e.target.value)} /></div>
      </div>

      {/* KYC Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.pendingKyc}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.approvedKyc}</div>
            <p className="text-xs text-muted-foreground">Verified users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.rejectedKyc}</div>
            <p className="text-xs text-muted-foreground">Need resubmission</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incomplete KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers.filter(u => u.kycStatus === 'incomplete').length}</div>
            <p className="text-xs text-muted-foreground">No documents</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(u => {
          const StatusIcon = getKycStatusIcon(u.kycStatus);
          return (
            <Card key={u.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{u.name}</span>
                  <span className="text-xs text-muted-foreground">{u.id}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-muted-foreground">{u.email}</div>
                <div>Balance: ₹{(u.balance/100).toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <Badge variant="outline" className={getKycStatusColor(u.kycStatus)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {u.kycStatus}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2 flex-wrap">
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/users/${u.id}`)}>View</Button>
                  <Button size="sm" variant="outline" onClick={() => quickRestrict(u.id)}>Restrict</Button>
                  <Button size="sm" variant="destructive" onClick={() => quickHold(u.id)}>Hold Funds</Button>
                  {u.kycStatus === 'pending' && (
                    <>
                      <Button size="sm" variant="default" className="bg-success hover:bg-success/90" onClick={() => quickApproveKyc(u.id)}>
                        <UserCheck className="h-3 w-3 mr-1" />
                        Approve KYC
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => quickRejectKyc(u.id)}>
                        <UserX className="h-3 w-3 mr-1" />
                        Reject KYC
                      </Button>
                    </>
                  )}
                  {u.kycStatus === 'incomplete' && (
                    <Button size="sm" variant="outline" onClick={() => toast.info(`Requested KYC documents from ${u.id} (mock)`)}>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Request KYC
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

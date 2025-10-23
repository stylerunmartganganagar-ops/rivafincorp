import { useState } from "react";
import { useParams } from "react-router-dom";
import { adminUsers, userTransactionsMap } from "@/data/adminMock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserCheck, UserX, Clock, AlertCircle, FileText, Download, Eye } from "lucide-react";
import { KycDocument } from "@/data/adminMock";
import { format } from "date-fns";

export default function AdminUserDetail() {
  const { id } = useParams();
  const user = adminUsers.find(u => u.id === id);
  if (!user) return <div className="text-sm text-muted-foreground">User not found</div>;

  const [isKycDialogOpen, setIsKycDialogOpen] = useState(false);
  const [kycAction, setKycAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<KycDocument | null>(null);

  const act = (label: string) => () => toast.info(`${label} for ${user.id} (mock)`);

  const txns = userTransactionsMap[user.id] ?? [];

  const handleKycAction = (action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    const actionText = action === 'approve' ? 'Approved' : 'Rejected';
    toast.success(`${actionText} KYC for ${user.name} (mock)`);
    setIsKycDialogOpen(false);
    setRejectionReason('');
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

  const getDocumentStatusColor = (status: string) => {
    const colors = {
      approved: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      passport: 'Passport',
      aadhar: 'Aadhar Card',
      pan: 'PAN Card',
      bank_statement: 'Bank Statement',
      utility_bill: 'Utility Bill',
      photo: 'Photo'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{user.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={act("Restrict profile")}>Restrict</Button>
          <Button variant="destructive" onClick={act("Hold funds")}>Hold Funds</Button>
          <Button onClick={act("Unrestrict / Release hold")}>Unrestrict</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div>ID: {user.id}</div>
            <div>Email: {user.email}</div>
            <div>Phone: {user.phone}</div>
            <div>Created: {new Date(user.createdAt).toLocaleString()}</div>
            <div>Account: {user.restricted?"Restricted":"Active"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div>Available: ₹{(user.balance/100).toLocaleString()}</div>
            <div>On Hold: ₹{(user.hold/100).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div>Flags: {user.flags}</div>
            <div>Chargebacks: {user.chargebacks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>KYC Status</span>
              {(() => {
                const StatusIcon = getKycStatusIcon(user.kycStatus);
                return <StatusIcon className="h-4 w-4" />;
              })()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getKycStatusColor(user.kycStatus)}>
                {user.kycStatus}
              </Badge>
            </div>
            {user.kycSubmittedAt && (
              <div>Submitted: {new Date(user.kycSubmittedAt).toLocaleDateString()}</div>
            )}
            <div>Documents: {user.kycDocuments?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Actions */}
      {(user.kycStatus === 'pending' || user.kycStatus === 'incomplete') && (
        <Card>
          <CardHeader>
            <CardTitle>KYC Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Dialog open={isKycDialogOpen} onOpenChange={setIsKycDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-success hover:bg-success/90"
                    onClick={() => setKycAction('approve')}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Approve KYC
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Approve KYC</DialogTitle>
                    <DialogDescription>
                      Approve KYC verification for {user.name}. This will allow the user to access full platform features.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Are you sure you want to approve the KYC for this user? All submitted documents have been verified.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsKycDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleKycAction('approve')}>
                      Approve KYC
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isKycDialogOpen && kycAction === 'reject'} onOpenChange={(open) => {
                setIsKycDialogOpen(open);
                if (open) setKycAction('reject');
              }}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <UserX className="h-4 w-4 mr-2" />
                    Reject KYC
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Reject KYC</DialogTitle>
                    <DialogDescription>
                      Reject KYC verification for {user.name}. The user will be required to resubmit documents.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="reason">Reason for Rejection</Label>
                      <Textarea
                        id="reason"
                        placeholder="Please provide a detailed reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsKycDialogOpen(false);
                      setRejectionReason('');
                    }}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => handleKycAction('reject')}>
                      Reject KYC
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {user.kycStatus === 'incomplete' && (
                <Button variant="outline" onClick={act("Request KYC documents")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Request Documents
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KYC Documents */}
      {user.kycDocuments && user.kycDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>KYC Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {user.kycDocuments.map((doc) => (
                <Card key={doc.id} className="border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{getDocumentTypeLabel(doc.type)}</CardTitle>
                      <Badge variant="outline" className={getDocumentStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="text-muted-foreground">{doc.filename}</div>
                    <div className="text-xs text-muted-foreground">
                      Uploaded: {format(new Date(doc.uploadedAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                    {doc.rejectionReason && (
                      <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                        {doc.rejectionReason}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Transactions Card */}
      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4">Txn ID</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {txns.map(t => (
                  <tr key={t.id} className="border-t">
                    <td className="py-2 pr-4">{t.id}</td>
                    <td className="py-2 pr-4">₹{(t.amount/100).toLocaleString()}</td>
                    <td className="py-2 pr-4">{t.status}</td>
                    <td className="py-2 pr-4">{new Date(t.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

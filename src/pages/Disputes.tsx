import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AlertTriangle, Eye, MessageSquare, Upload, Download, Filter } from 'lucide-react';
import { Dispute, Chargeback } from '@/types/payment';
import { format } from 'date-fns';
import { mockDisputes, mockChargebacks } from '@/data/mockData';
import { isTestUser, emptyDisputes } from '@/data/userUtils';
import { useAuth } from '@/hooks/useAuth';

export default function Disputes() {
  const [activeTab, setActiveTab] = useState('disputes');
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const { user } = useAuth();

  useEffect(() => {
    // Check if current user is test user
    const showMockData = isTestUser(user?.email);
    setDisputes(showMockData ? mockDisputes : emptyDisputes);
  }, [user]);

  const [chargebacks, setChargebacks] = useState(mockChargebacks);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [responseText, setResponseText] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);

  useEffect(() => {
    // Check if current user is test user for chargebacks too
    const showMockData = isTestUser(user?.email);
    setChargebacks(showMockData ? mockChargebacks : []);
  }, [user]);

  const getStatusColor = (status: Dispute['status']) => {
    const colors = {
      open: 'bg-destructive/10 text-destructive border-destructive/20',
      investigating: 'bg-warning/10 text-warning border-warning/20',
      resolved: 'bg-success/10 text-success border-success/20',
      won: 'bg-success/10 text-success border-success/20',
      lost: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors[status];
  };

  const getChargebackStatusColor = (status: Chargeback['status']) => {
    const colors = {
      initiated: 'bg-destructive/10 text-destructive border-destructive/20',
      representment: 'bg-warning/10 text-warning border-warning/20',
      accepted: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-muted text-muted-foreground border-border'
    };
    return colors[status];
  };

  const handleSubmitResponse = (disputeId: string) => {
    if (!responseText.trim()) {
      toast.error('Please provide a response');
      return;
    }

    // In a real app, this would submit to an API
    toast.success('Response submitted successfully');
    setResponseText('');
    setEvidenceFiles([]);
  };

  const openDisputes = disputes.filter(d => d.status === 'open' || d.status === 'investigating');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Disputes & Chargebacks</h2>
            <p className="text-muted-foreground">
              Manage dispute resolution and chargeback responses
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openDisputes.length}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Chargebacks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chargebacks.length}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedDisputes.length}</div>
              <p className="text-xs text-muted-foreground">Successfully closed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Disputed Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(disputes.reduce((sum, d) => sum + d.amount, 0) / 100).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">At risk</p>
            </CardContent>
          </Card>
        </div>

        {/* Chargebacks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Active Chargebacks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chargeback ID</TableHead>
                  <TableHead>Dispute ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Initiated</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chargebacks.map((chargeback) => (
                  <TableRow key={chargeback.id}>
                    <TableCell className="font-mono text-sm">{chargeback.id}</TableCell>
                    <TableCell>{chargeback.disputeId}</TableCell>
                    <TableCell className="font-semibold">
                      ₹{(chargeback.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getChargebackStatusColor(chargeback.status)}>
                        {chargeback.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(chargeback.initiatedAt, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(chargeback.dueDate, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Chargeback Details</DialogTitle>
                            <DialogDescription>
                              Review and respond to this chargeback
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Chargeback ID</Label>
                                <p className="text-sm font-mono">{chargeback.id}</p>
                              </div>
                              <div>
                                <Label>Amount</Label>
                                <p className="text-sm font-semibold">₹{(chargeback.amount / 100).toFixed(2)}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge variant="outline" className={getChargebackStatusColor(chargeback.status)}>
                                  {chargeback.status}
                                </Badge>
                              </div>
                              <div>
                                <Label>Due Date</Label>
                                <p className="text-sm text-muted-foreground">
                                  {format(chargeback.dueDate, 'MMM dd, yyyy HH:mm')}
                                </p>
                              </div>
                            </div>
                            {chargeback.response && (
                              <div>
                                <Label>Your Response</Label>
                                <p className="text-sm bg-muted p-3 rounded">{chargeback.response}</p>
                              </div>
                            )}
                            {chargeback.documents && chargeback.documents.length > 0 && (
                              <div>
                                <Label>Submitted Documents</Label>
                                <div className="space-y-1">
                                  {chargeback.documents.map((doc, index) => (
                                    <p key={index} className="text-sm text-muted-foreground">• {doc}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Disputes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dispute History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dispute ID</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
                    <TableCell>{dispute.transactionId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{dispute.customerName}</p>
                        <p className="text-sm text-muted-foreground">{dispute.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{(dispute.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(dispute.status)}>
                        {dispute.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{dispute.reason}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(dispute.createdAt, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Dispute Details</DialogTitle>
                              <DialogDescription>
                                Review dispute information and submit your response
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Dispute ID</Label>
                                  <p className="text-sm font-mono">{dispute.id}</p>
                                </div>
                                <div>
                                  <Label>Transaction ID</Label>
                                  <p className="text-sm font-mono">{dispute.transactionId}</p>
                                </div>
                                <div>
                                  <Label>Customer</Label>
                                  <p className="text-sm">{dispute.customerName}</p>
                                </div>
                                <div>
                                  <Label>Amount</Label>
                                  <p className="text-sm font-semibold">₹{(dispute.amount / 100).toFixed(2)}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Badge variant="outline" className={getStatusColor(dispute.status)}>
                                    {dispute.status}
                                  </Badge>
                                </div>
                                <div>
                                  <Label>Reason</Label>
                                  <p className="text-sm">{dispute.reason}</p>
                                </div>
                              </div>

                              {dispute.evidence && dispute.evidence.length > 0 && (
                                <div>
                                  <Label>Customer Evidence</Label>
                                  <div className="space-y-1">
                                    {dispute.evidence.map((evidence, index) => (
                                      <p key={index} className="text-sm text-muted-foreground">• {evidence}</p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {(dispute.status === 'open' || dispute.status === 'investigating') && (
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="response">Your Response</Label>
                                    <Textarea
                                      id="response"
                                      placeholder="Provide your response to this dispute..."
                                      value={responseText}
                                      onChange={(e) => setResponseText(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label>Upload Evidence</Label>
                                    <Input
                                      type="file"
                                      multiple
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        setEvidenceFiles(files);
                                      }}
                                    />
                                    {evidenceFiles.length > 0 && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {evidenceFiles.length} file(s) selected
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => handleSubmitResponse(dispute.id)}>
                                      Submit Response
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

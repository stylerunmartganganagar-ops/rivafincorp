import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Eye, Download, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/supabase';
import { toast } from 'sonner';

type KycDocument = Tables<'kyc_documents'>;

const DOCUMENT_TYPES = [
  { id: 'passport', label: 'Passport', description: 'Valid passport copy' },
  { id: 'aadhar', label: 'Aadhar Card', description: 'Aadhar card front and back' },
  { id: 'pan', label: 'PAN Card', description: 'PAN card copy' },
  { id: 'bank_statement', label: 'Bank Statement', description: 'Recent 3 months bank statement' },
  { id: 'utility_bill', label: 'Utility Bill', description: 'Electricity/gas bill (not older than 3 months)' },
  { id: 'photo', label: 'Recent Photo', description: 'Clear passport size photo' },
];

export default function KycSettings() {
  const [documents, setDocuments] = useState<KycDocument[]>([]);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<KycDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadKycDocuments();
  }, []);

  const loadKycDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading KYC documents:', error);
      toast.error('Failed to load KYC documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(documentType);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}-${user.id}-${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(`${user.id}/${fileName}`, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(`${user.id}/${fileName}`);

      // Save document record
      const { error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: documentType as any,
          filename: fileName,
          file_url: publicUrl,
          status: 'pending'
        });

      if (dbError) throw dbError;

      toast.success('Document uploaded successfully');
      await loadKycDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(null);
    }
  };

  const getDocumentStatus = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Under Review' },
      approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Approved' },
      rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Rejected' },
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getLatestDocument = (type: string) => {
    return documents.find(doc => doc.document_type === type);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <SettingsLayout activeTab="kyc">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading KYC documents...</p>
          </div>
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout activeTab="kyc">
      <div className="space-y-6">
        {/* KYC Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>KYC Verification Status</CardTitle>
            <CardDescription>
              Track your document submission and approval status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'approved').length}
                </div>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'pending').length}
                </div>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {documents.filter(d => d.status === 'rejected').length}
                </div>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOCUMENT_TYPES.map((docType) => {
            const existingDoc = getLatestDocument(docType.id);
            const status = existingDoc ? getDocumentStatus(existingDoc.status) : null;
            const StatusIcon = status?.icon;

            return (
              <Card key={docType.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{docType.label}</CardTitle>
                    {existingDoc && StatusIcon && (
                      <StatusIcon className={`h-5 w-5 ${status.color}`} />
                    )}
                  </div>
                  <CardDescription>{docType.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {existingDoc ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`${status?.bg} ${status?.color} border-current`}>
                          {status?.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(existingDoc.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>

                      {existingDoc.rejection_reason && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-red-800">
                            {existingDoc.rejection_reason}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocument(existingDoc)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{docType.label}</DialogTitle>
                              <DialogDescription>
                                Document uploaded on {new Date(existingDoc.uploaded_at).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center">
                              {existingDoc.file_url.includes('.pdf') ? (
                                <iframe
                                  src={existingDoc.file_url}
                                  className="w-full h-96 border rounded"
                                  title={docType.label}
                                />
                              ) : (
                                <img
                                  src={existingDoc.file_url}
                                  alt={docType.label}
                                  className="max-w-full max-h-96 object-contain"
                                />
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(existingDoc.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No document uploaded</p>
                      </div>

                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(docType.id, file);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={isUploading === docType.id}
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled={isUploading === docType.id}
                        >
                          {isUploading === docType.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Document
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Document Requirements:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Clear, high-quality images</li>
                  <li>• All text must be readable</li>
                  <li>• No watermarks or edits</li>
                  <li>• Documents must be valid and current</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Supported Formats:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Images: JPG, PNG, GIF, WebP</li>
                  <li>• Documents: PDF (max 5MB)</li>
                  <li>• Images: Max 5MB each</li>
                  <li>• Multiple files for same document type allowed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}

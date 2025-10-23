import { useState, useEffect } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TransactionTable } from '@/components/dashboard/TransactionTable';
import { SettlementsPanel } from '@/components/dashboard/SettlementsPanel';
import { mockTransactions, mockSettlements, mockStats } from '@/data/mockData';
import { isTestUser, emptyStats, emptyTransactions, emptySettlements } from '@/data/userUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type BusinessEntityType =
  | 'proprietorship'
  | 'private_limited'
  | 'llp'
  | 'partnership'
  | 'msme';

interface DocumentRequirement {
  id: string;
  name: string;
  required: boolean;
}

const businessEntityTypes: Record<BusinessEntityType, { name: string; documents: DocumentRequirement[] }> = {
  proprietorship: {
    name: 'Proprietorship',
    documents: [
      { id: 'pan_proprietor', name: 'PAN Card of Proprietor', required: true },
      { id: 'aadhaar_proprietor', name: 'Aadhaar Card of Proprietor', required: true },
      { id: 'business_registration', name: 'Business Registration Certificate / Shop Establishment Certificate / GST Certificate', required: true },
      { id: 'bank_proof', name: 'Bank Account Proof (Cancelled Cheque / Bank Statement)', required: true },
      { id: 'address_proof', name: 'Address Proof of Business (Utility Bill / Rent Agreement / Ownership Proof)', required: true }
    ]
  },
  private_limited: {
    name: 'Private Limited Company',
    documents: [
      { id: 'incorporation_certificate', name: 'Certificate of Incorporation', required: true },
      { id: 'moa_aoa', name: 'Memorandum of Association (MOA) & Articles of Association (AOA)', required: true },
      { id: 'company_pan', name: 'Company PAN Card', required: true },
      { id: 'gst_certificate', name: 'GST Certificate (if applicable)', required: false },
      { id: 'board_resolution', name: 'Board Resolution authorizing signatory', required: true },
      { id: 'pan_aadhaar_signatory', name: 'PAN & Aadhaar of Authorized Signatory / Directors', required: true },
      { id: 'bank_proof', name: 'Bank Account Proof (Cancelled Cheque / Bank Statement)', required: true },
      { id: 'registered_office_proof', name: 'Address Proof of Registered Office (Utility Bill / Rent Agreement)', required: true }
    ]
  },
  llp: {
    name: 'Limited Liability Partnership (LLP)',
    documents: [
      { id: 'llp_incorporation', name: 'LLP Incorporation Certificate', required: true },
      { id: 'llp_agreement', name: 'LLP Agreement', required: true },
      { id: 'llp_pan', name: 'PAN Card of LLP', required: true },
      { id: 'gst_certificate', name: 'GST Certificate (if applicable)', required: false },
      { id: 'pan_aadhaar_partners', name: 'PAN & Aadhaar of Authorized Partner(s)', required: true },
      { id: 'bank_proof', name: 'Bank Account Proof (Cancelled Cheque / Bank Statement)', required: true },
      { id: 'registered_office_proof', name: 'Registered Office Address Proof', required: true }
    ]
  },
  partnership: {
    name: 'Partnership Firm',
    documents: [
      { id: 'partnership_deed', name: 'Partnership Deed', required: true },
      { id: 'firm_pan', name: 'PAN Card of Firm', required: true },
      { id: 'gst_certificate', name: 'GST Certificate (if applicable)', required: false },
      { id: 'pan_aadhaar_partners', name: 'PAN & Aadhaar of All Partners', required: true },
      { id: 'bank_proof', name: 'Bank Account Proof (Cancelled Cheque / Bank Statement)', required: true },
      { id: 'business_address_proof', name: 'Business Address Proof (Utility Bill / Rent Agreement)', required: true }
    ]
  },
  msme: {
    name: 'MSME (Any Registered Entity under MSME)',
    documents: [
      { id: 'msme_registration', name: 'MSME / Udyam Registration Certificate', required: true },
      { id: 'entity_pan', name: 'PAN Card of Entity', required: true },
      { id: 'gst_certificate', name: 'GST Certificate (if applicable)', required: false },
      { id: 'pan_aadhaar_owners', name: 'PAN & Aadhaar of Proprietor / Partners / Directors (as applicable)', required: true },
      { id: 'bank_proof', name: 'Bank Account Proof (Cancelled Cheque / Bank Statement)', required: true },
      { id: 'business_address_proof', name: 'Business Address Proof', required: true }
    ]
  }
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isKycDialogOpen, setIsKycDialogOpen] = useState(false);
  const [kycStep, setKycStep] = useState<'entity_type' | 'documents'>('entity_type');
  const [selectedEntityType, setSelectedEntityType] = useState<BusinessEntityType | null>(null);
  const [kycFormData, setKycFormData] = useState<Record<string, any>>({});
  const [kycStatus, setKycStatus] = useState<'incomplete' | 'submitted' | 'pending' | 'approved' | 'rejected'>('incomplete');
  const { user } = useAuth();

  // Initialize KYC status from DB and decide whether to show dialog
  useEffect(() => {
    const initKycFromDb = async () => {
      try {
        const { data: authUser } = await supabase.auth.getUser();
        const authUserId = authUser?.user?.id;
        if (!authUserId) {
          // No session yet: show dialog so user can login/submit
          setIsKycDialogOpen(true);
          return;
        }

        const { data, error } = await supabase
          .from('kyc_applications')
          .select('status')
          .eq('user_id', authUserId)
          .order('submitted_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data?.status) {
          const dbStatus = data.status as 'incomplete' | 'submitted' | 'pending' | 'approved' | 'rejected';
          setKycStatus(dbStatus);
          setIsKycDialogOpen(dbStatus === 'incomplete' || dbStatus === 'rejected');
        } else {
          // No record yet
          setKycStatus('incomplete');
          setIsKycDialogOpen(true);
        }
      } catch (e) {
        // Fallback to show dialog
        setKycStatus('incomplete');
        setIsKycDialogOpen(true);
      }
    };
    initKycFromDb();
  }, []);

  const handleKycSubmit = () => {
    // Handle KYC submission
    setIsKycDialogOpen(false);
  };

  const handleEntityTypeSelect = (entityType: BusinessEntityType) => {
    setSelectedEntityType(entityType);
    setKycStep('documents');
  };

  const handleDocumentUpload = (documentId: string, file: File) => {
    setKycFormData(prev => ({
      ...prev,
      [documentId]: file
    }));
  };

  const handleBackToEntityType = () => {
    setKycStep('entity_type');
    setSelectedEntityType(null);
    setKycFormData({});
  };

  const handleDocumentsSubmit = async () => {
    // Validate basic information
    const requiredFields = ['fullName', 'email', 'phone', 'businessName', 'businessAddress'];
    const missingFields = requiredFields.filter(field => !kycFormData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate required documents
    if (!selectedEntityType) return;

    const requiredDocs = businessEntityTypes[selectedEntityType].documents.filter(doc => doc.required);
    const missingDocs = requiredDocs.filter(doc => !kycFormData[doc.id]);

    if (missingDocs.length > 0) {
      alert(`Please upload the following required documents: ${missingDocs.map(doc => doc.name).join(', ')}`);
      return;
    }

    try {
      if (!user?.id) {
        alert('You must be logged in to submit KYC.');
        return;
      }
      const userId = user.id;
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        alert('Your session expired. Please log in again and retry KYC.');
        setKycStatus('incomplete');
        return;
      }
      const { data: authUserData } = await supabase.auth.getUser();
      const authUserId = authUserData?.user?.id;
      const ownerId = authUserId || userId;
      if (authUserId && authUserId !== userId) {
        console.warn('Supabase auth userId differs from app userId', { authUserId, appUserId: userId });
      }
      setKycStatus('submitted');
      window.dispatchEvent(new CustomEvent('kyc-status-changed', { detail: 'submitted' }));

      // Prepare KYC data for database
      const kycData = {
        user_id: ownerId,
        entity_type: selectedEntityType,
        full_name: kycFormData.fullName,
        email: kycFormData.email,
        phone: kycFormData.phone,
        business_name: kycFormData.businessName,
        business_address: kycFormData.businessAddress,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        documents: {}
      };

      // Upload documents to Supabase Storage and collect storage keys (not URLs)
      const documentKeys: Record<string, string> = {};

      for (const doc of businessEntityTypes[selectedEntityType].documents) {
        if (kycFormData[doc.id]) {
          const file = kycFormData[doc.id] as File;
          const fileExt = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
          const fileName = `${ownerId}/${selectedEntityType}/${doc.id}-${Date.now()}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('kyc-documents')
            .upload(fileName, file, { upsert: true, contentType: file.type || undefined });

          if (uploadError) {
            console.error('Error uploading document:', uploadError);
            console.error('Upload error details:', JSON.stringify(uploadError, null, 2));
            console.error('File details:', { name: file.name, size: file.size, type: file.type });
            console.error('Upload path:', fileName);

            // If this is a false negative (e.g., already exists), verify existence and proceed
            const folder = `${ownerId}/${selectedEntityType}`;
            const base = fileName.split('/').pop() || '';
            try {
              const { data: listed, error: listError } = await supabase.storage
                .from('kyc-documents')
                .list(folder);
              if (!listError && listed && listed.some((f) => f.name === base)) {
                console.warn('Upload error but object exists, proceeding:', fileName);
                // proceed as success
              } else {
                alert(`Failed to upload ${doc.name}. Error: ${uploadError.message || 'Unknown error'}`);
                setKycStatus('incomplete');
                return;
              }
            } catch (e) {
              alert(`Failed to upload ${doc.name}. Error: ${uploadError.message || 'Unknown error'}`);
              setKycStatus('incomplete');
              return;
            }
          }

          // Store the object key for later signed URL retrieval
          documentKeys[doc.id] = fileName;
        }
      }

      kycData.documents = documentKeys;

      // Save KYC application to database (no select to avoid extra RLS SELECT)
      const { error } = await supabase
        .from('kyc_applications')
        .insert([kycData]);

      if (error) {
        console.error('Error saving KYC application:', error);
        alert('Failed to submit KYC application. Please try again.');
        setKycStatus('incomplete');
        return;
      }

      console.log('KYC Application submitted successfully');

      // KYC now stays as 'submitted' until admin manually approves/rejects
      setKycStatus('submitted');
      window.dispatchEvent(new CustomEvent('kyc-status-changed', { detail: 'submitted' }));

      setIsKycDialogOpen(false);
      // Reset state
      setKycStep('entity_type');
      setSelectedEntityType(null);
      setKycFormData({});

    } catch (error) {
      console.error('Error submitting KYC:', error);
      alert('An error occurred while submitting your KYC. Please try again.');
      setKycStatus('incomplete');
    }
  };

  // Determine if current user is test user
  const showMockData = isTestUser(user?.email);

  // Use mock data for test user, empty data for others
  const stats = showMockData ? mockStats : emptyStats;
  const transactions = showMockData ? mockTransactions : emptyTransactions;
  const settlements = showMockData ? mockSettlements : emptySettlements;

  console.log('Index.tsx: kycStatus =', kycStatus);
  console.log('Index.tsx: passing kycStatus prop =', kycStatus === 'incomplete' ? undefined : kycStatus);

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      kycStatus={kycStatus === 'incomplete' ? undefined : kycStatus}
    >
      <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your payment gateway.
          </p>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionTable transactions={transactions} />
          </div>
          <div>
            <SettlementsPanel settlements={settlements} />
          </div>
        </div>

        <Dialog open={isKycDialogOpen} onOpenChange={setIsKycDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
              {kycStep === 'documents' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToEntityType}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              Complete Your KYC
            </DialogTitle>
            <DialogDescription>
              {kycStep === 'entity_type'
                ? 'Please select your business entity type to proceed with KYC verification.'
                : 'Please upload the required documents for your business entity type.'
              }
            </DialogDescription>
          </DialogHeader>

          {kycStep === 'entity_type' && (
            <div className="space-y-4">
              <div className="grid gap-3">
                {Object.entries(businessEntityTypes).map(([key, entity]) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="h-auto p-4 justify-start text-left"
                    onClick={() => handleEntityTypeSelect(key as BusinessEntityType)}
                  >
                    <div>
                      <div className="font-medium">{entity.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {entity.documents.length} document{entity.documents.length !== 1 ? 's' : ''} required
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {kycStep === 'documents' && selectedEntityType && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Selected Entity Type: {businessEntityTypes[selectedEntityType].name}</h3>
                <p className="text-sm text-muted-foreground">
                  Please provide your basic information and upload the required documents.
                </p>
              </div>

              {/* Basic Information Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Basic Information</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={kycFormData.fullName || ''}
                      onChange={(e) => setKycFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={user?.email || 'Enter your email'}
                      value={kycFormData.email ?? ''}
                      onChange={(e) => setKycFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={kycFormData.phone || ''}
                      onChange={(e) => setKycFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Enter business name"
                      value={kycFormData.businessName || ''}
                      onChange={(e) => setKycFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Input
                    id="businessAddress"
                    placeholder="Enter complete business address"
                    value={kycFormData.businessAddress || ''}
                    onChange={(e) => setKycFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Required Documents</h4>
                {businessEntityTypes[selectedEntityType].documents.map((doc) => (
                  <div key={doc.id} className="space-y-2">
                    <Label htmlFor={doc.id} className="flex items-center gap-2">
                      {doc.name}
                      {doc.required && <span className="text-destructive">*</span>}
                      {!doc.required && <span className="text-muted-foreground">(Optional)</span>}
                    </Label>
                    <Input
                      id={doc.id}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(doc.id, file);
                        }
                      }}
                      className="cursor-pointer"
                      required={doc.required}
                    />
                    {kycFormData[doc.id] && (
                      <p className="text-sm text-green-600">
                        ✓ {kycFormData[doc.id].name} uploaded
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleBackToEntityType}>
                  Back
                </Button>
                <Button onClick={handleDocumentsSubmit}>
                  Submit KYC Documents
                </Button>
              </div>
            </div>
          )}

          {kycStep === 'entity_type' && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsKycDialogOpen(false)}>
                Skip for Now
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Index;

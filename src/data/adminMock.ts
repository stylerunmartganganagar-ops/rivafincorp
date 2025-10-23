export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  balance: number;
  hold: number;
  restricted: boolean;
  flags: number;
  chargebacks: number;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'incomplete';
  kycSubmittedAt?: string;
  kycDocuments?: KycDocument[];
}

export interface KycDocument {
  id: string;
  type: 'passport' | 'aadhar' | 'pan' | 'bank_statement' | 'utility_bill' | 'photo';
  filename: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface AdminTxn {
  id: string;
  userId: string;
  amount: number;
  status: 'success'|'failed'|'pending'|'refunded';
  date: string;
}

export interface AdminSettlement {
  id: string;
  userId: string;
  amount: number;
  status: 'pending'|'processing'|'settled'|'failed';
  date: string;
}

export const adminUsers: AdminUser[] = [
  {
    id: 'usr_001',
    name: 'Acme Corp',
    email: 'ops@acme.com',
    phone: '+91 90000 00001',
    createdAt: '2025-09-10T10:00:00Z',
    balance: 5600000,
    hold: 120000,
    restricted: false,
    flags: 0,
    chargebacks: 1,
    kycStatus: 'approved',
    kycSubmittedAt: '2025-09-12T14:30:00Z',
    kycDocuments: [
      {
        id: 'kyc_001',
        type: 'pan',
        filename: 'PAN_Card_Acme.pdf',
        url: '/kyc/pan_acme.pdf',
        uploadedAt: '2025-09-12T14:30:00Z',
        status: 'approved'
      },
      {
        id: 'kyc_002',
        type: 'bank_statement',
        filename: 'Bank_Statement_Acme.pdf',
        url: '/kyc/bank_acme.pdf',
        uploadedAt: '2025-09-12T14:30:00Z',
        status: 'approved'
      }
    ]
  },
  {
    id: 'usr_002',
    name: 'Orion Pvt Ltd',
    email: 'finance@orion.com',
    phone: '+91 90000 00002',
    createdAt: '2025-07-21T12:00:00Z',
    balance: 12000500,
    hold: 0,
    restricted: true,
    flags: 2,
    chargebacks: 0,
    kycStatus: 'pending',
    kycSubmittedAt: '2025-10-18T09:00:00Z',
    kycDocuments: [
      {
        id: 'kyc_003',
        type: 'aadhar',
        filename: 'Aadhar_Orion.pdf',
        url: '/kyc/aadhar_orion.pdf',
        uploadedAt: '2025-10-18T09:00:00Z',
        status: 'pending'
      },
      {
        id: 'kyc_004',
        type: 'photo',
        filename: 'Photo_Orion.jpg',
        url: '/kyc/photo_orion.jpg',
        uploadedAt: '2025-10-18T09:00:00Z',
        status: 'pending'
      }
    ]
  },
  {
    id: 'usr_003',
    name: 'BlueBerry Stores',
    email: 'team@blueberry.in',
    phone: '+91 90000 00003',
    createdAt: '2025-08-01T09:00:00Z',
    balance: 2434000,
    hold: 50000,
    restricted: false,
    flags: 1,
    chargebacks: 2,
    kycStatus: 'rejected',
    kycSubmittedAt: '2025-08-05T11:00:00Z',
    kycDocuments: [
      {
        id: 'kyc_005',
        type: 'passport',
        filename: 'Passport_BlueBerry.pdf',
        url: '/kyc/passport_blueberry.pdf',
        uploadedAt: '2025-08-05T11:00:00Z',
        status: 'rejected',
        rejectionReason: 'Document quality is poor, please upload a clearer copy'
      }
    ]
  },
  {
    id: 'usr_004',
    name: 'Tech Solutions Ltd',
    email: 'admin@techsolutions.com',
    phone: '+91 90000 00004',
    createdAt: '2025-10-15T16:00:00Z',
    balance: 1250000,
    hold: 0,
    restricted: false,
    flags: 0,
    chargebacks: 0,
    kycStatus: 'incomplete',
    kycSubmittedAt: undefined,
    kycDocuments: []
  }
];

export const mockAdminStats = {
  totalUsers: adminUsers.length,
  activeHolds: adminUsers.filter(u => u.hold>0).length,
  flaggedAccounts: adminUsers.filter(u => u.flags>0 || u.restricted).length,
  pendingSettlementVolume: 8450000,
  pendingKyc: adminUsers.filter(u => u.kycStatus === 'pending').length,
  approvedKyc: adminUsers.filter(u => u.kycStatus === 'approved').length,
  rejectedKyc: adminUsers.filter(u => u.kycStatus === 'rejected').length,
};

export const recentAdminActivity = [
  { id: 'act_001', action: 'Approved KYC for Acme Corp', at: '2025-10-19T11:00:00Z' },
  { id: 'act_002', action: 'Rejected KYC for BlueBerry Stores', at: '2025-10-19T15:20:00Z' },
  { id: 'act_003', action: 'Requested KYC documents from Tech Solutions Ltd', at: '2025-10-20T08:10:00Z' },
  { id: 'act_004', action: 'Restricted Orion Pvt Ltd', at: '2025-10-19T11:00:00Z' },
  { id: 'act_005', action: 'Released hold for Acme Corp', at: '2025-10-19T15:20:00Z' },
  { id: 'act_006', action: 'Flagged txn TXN_90812', at: '2025-10-20T08:10:00Z' },
];

export const adminTransactions: AdminTxn[] = [
  { id: 'TXN_1001', userId: 'usr_001', amount: 120000, status: 'success', date: '2025-10-20T08:00:00Z' },
  { id: 'TXN_1002', userId: 'usr_002', amount: 450000, status: 'pending', date: '2025-10-20T09:00:00Z' },
  { id: 'TXN_1003', userId: 'usr_003', amount: 890000, status: 'failed', date: '2025-10-19T14:30:00Z' },
];

export const adminSettlements: AdminSettlement[] = [
  { id: 'STL_9001', userId: 'usr_001', amount: 3200000, status: 'processing', date: '2025-10-19' },
  { id: 'STL_9002', userId: 'usr_002', amount: 2100000, status: 'pending', date: '2025-10-20' },
];

export const userTransactionsMap: Record<string, AdminTxn[]> = {
  usr_001: [ { id: 'TXN_1001', userId: 'usr_001', amount: 120000, status: 'success', date: '2025-10-20T08:00:00Z' } ],
  usr_002: [ { id: 'TXN_1002', userId: 'usr_002', amount: 450000, status: 'pending', date: '2025-10-20T09:00:00Z' } ],
  usr_003: [ { id: 'TXN_1003', userId: 'usr_003', amount: 890000, status: 'failed', date: '2025-10-19T14:30:00Z' } ],
};

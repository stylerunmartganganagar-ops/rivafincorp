import { Transaction, Settlement, DashboardStats, Refund, Dispute, Chargeback, Payout, Bank, SupportedBanks, BankDetails } from '@/types/payment';

export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    amount: 15000,
    currency: 'INR',
    status: 'success',
    customer: 'John Doe',
    email: 'john@example.com',
    method: 'UPI',
    date: new Date('2025-10-20T10:30:00'),
    orderId: 'ORD_1001',
    fee: 300,
    tax: 54,
    net: 14646
  },
  {
    id: 'txn_002',
    amount: 25000,
    currency: 'INR',
    status: 'success',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    method: 'Card',
    date: new Date('2025-10-20T09:15:00'),
    orderId: 'ORD_1002',
    fee: 500,
    tax: 90,
    net: 24410
  },
  {
    id: 'txn_003',
    amount: 8000,
    currency: 'INR',
    status: 'pending',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    method: 'Net Banking',
    date: new Date('2025-10-20T08:45:00'),
    orderId: 'ORD_1003',
    fee: 160,
    tax: 28.8,
    net: 7811.2
  },
  {
    id: 'txn_004',
    amount: 12000,
    currency: 'INR',
    status: 'failed',
    customer: 'Sarah Williams',
    email: 'sarah@example.com',
    method: 'UPI',
    date: new Date('2025-10-19T16:20:00'),
    orderId: 'ORD_1004',
    fee: 0,
    tax: 0,
    net: 0
  },
  {
    id: 'txn_005',
    amount: 50000,
    currency: 'INR',
    status: 'success',
    customer: 'Robert Brown',
    email: 'robert@example.com',
    method: 'Card',
    date: new Date('2025-10-19T14:10:00'),
    orderId: 'ORD_1005',
    fee: 1000,
    tax: 180,
    net: 48820
  }
];

export const mockSettlements: Settlement[] = [
  {
    id: 'stl_001',
    amount: 95000,
    currency: 'INR',
    status: 'settled',
    date: new Date('2025-10-18'),
    utr: 'UTR202510180001',
    transactionCount: 25,
    fee: 1900,
    tax: 342,
    net: 92758
  },
  {
    id: 'stl_002',
    amount: 120000,
    currency: 'INR',
    status: 'processing',
    date: new Date('2025-10-19'),
    transactionCount: 32,
    fee: 2400,
    tax: 432,
    net: 117168
  },
  {
    id: 'stl_003',
    amount: 40000,
    currency: 'INR',
    status: 'pending',
    date: new Date('2025-10-20'),
    transactionCount: 10,
    fee: 800,
    tax: 144,
    net: 39056
  }
];

export const mockStats: DashboardStats = {
  totalRevenue: 2450000,
  totalTransactions: 1248,
  successRate: 94.5,
  pendingSettlements: 40000,
  todayRevenue: 110000,
  todayTransactions: 28
};

// Mock refunds data
export const mockRefunds: Refund[] = [
  {
    id: 'ref_001',
    transactionId: 'txn_001',
    amount: 15000,
    currency: 'INR',
    status: 'completed',
    reason: 'Product returned - customer dissatisfaction',
    requestedBy: 'merchant',
    requestedAt: new Date('2025-10-19T14:30:00'),
    processedAt: new Date('2025-10-19T16:45:00'),
    refundMethod: 'original',
  },
  {
    id: 'ref_002',
    transactionId: 'txn_005',
    amount: 50000,
    currency: 'INR',
    status: 'pending',
    reason: 'Duplicate payment',
    requestedBy: 'merchant',
    requestedAt: new Date('2025-10-20T10:15:00'),
    refundMethod: 'bank_transfer',
    bankDetails: {
      accountNumber: '1234567890',
      accountHolderName: 'Robert Brown',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234',
      accountType: 'savings'
    }
  },
  {
    id: 'ref_003',
    transactionId: 'txn_002',
    amount: 25000,
    currency: 'INR',
    status: 'processing',
    reason: 'Service not delivered',
    requestedBy: 'customer',
    requestedAt: new Date('2025-10-20T11:20:00'),
    refundMethod: 'original'
  }
];

// Mock disputes and chargebacks data
export const mockDisputes: Dispute[] = [
  {
    id: 'dis_001',
    transactionId: 'txn_003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    amount: 8000,
    currency: 'INR',
    status: 'open',
    reason: 'Product not received',
    evidence: [],
    createdAt: new Date('2025-10-18T09:00:00'),
    updatedAt: new Date('2025-10-18T09:00:00'),
    chargebackId: 'cb_001'
  },
  {
    id: 'dis_002',
    transactionId: 'txn_004',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah@example.com',
    amount: 12000,
    currency: 'INR',
    status: 'investigating',
    reason: 'Fraudulent transaction',
    evidence: ['receipt.pdf', 'communication_log.pdf'],
    createdAt: new Date('2025-10-17T16:30:00'),
    updatedAt: new Date('2025-10-19T11:15:00'),
    chargebackId: 'cb_002'
  }
];

export const mockChargebacks: Chargeback[] = [
  {
    id: 'cb_001',
    disputeId: 'dis_001',
    amount: 8000,
    currency: 'INR',
    status: 'initiated',
    initiatedAt: new Date('2025-10-18T09:00:00'),
    dueDate: new Date('2025-10-25T23:59:59'),
  },
  {
    id: 'cb_002',
    disputeId: 'dis_002',
    amount: 12000,
    currency: 'INR',
    status: 'representment',
    initiatedAt: new Date('2025-10-17T16:30:00'),
    dueDate: new Date('2025-10-24T23:59:59'),
    response: 'Transaction was legitimate - customer confirmed receipt',
    documents: ['proof_of_delivery.pdf', 'customer_confirmation.pdf']
  }
];

// Mock payouts data
export const mockPayouts: Payout[] = [
  {
    id: 'po_001',
    amount: 500000,
    currency: 'INR',
    status: 'completed',
    bankDetails: {
      accountNumber: '9876543210',
      accountHolderName: 'Merchant Business',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      accountType: 'current'
    },
    requestedAt: new Date('2025-10-15T10:00:00'),
    processedAt: new Date('2025-10-15T14:30:00'),
    referenceId: 'PO_REF_001',
    fee: 500,
    netAmount: 499500
  },
  {
    id: 'po_002',
    amount: 250000,
    currency: 'INR',
    status: 'processing',
    bankDetails: {
      accountNumber: '9876543210',
      accountHolderName: 'Merchant Business',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0005678',
      accountType: 'current'
    },
    requestedAt: new Date('2025-10-20T09:00:00'),
    referenceId: 'PO_REF_002',
    fee: 250,
    netAmount: 249750
  }
];

// Supported banks for payout selection (now loaded from database)
// This is kept for fallback only
export const mockSupportedBanks: SupportedBanks = {
  'Major Banks': [
    { id: 'sbi', name: 'State Bank of India', ifscPrefix: 'SBIN' },
    { id: 'hdfc', name: 'HDFC Bank', ifscPrefix: 'HDFC' },
    { id: 'icici', name: 'ICICI Bank', ifscPrefix: 'ICIC' },
    { id: 'axis', name: 'Axis Bank', ifscPrefix: 'UTIB' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', ifscPrefix: 'KKBK' }
  ],
  'Regional Banks': [
    { id: 'pnb', name: 'Punjab National Bank', ifscPrefix: 'PUNB' },
    { id: 'bob', name: 'Bank of Baroda', ifscPrefix: 'BARB' },
    { id: 'canara', name: 'Canara Bank', ifscPrefix: 'CNRB' },
    { id: 'union', name: 'Union Bank of India', ifscPrefix: 'UBIN' },
    { id: 'indian', name: 'Indian Bank', ifscPrefix: 'IDIB' }
  ],
  'Digital Banks': [
    { id: 'paytm', name: 'Paytm Payments Bank', ifscPrefix: 'PYTM' },
    { id: 'airtel', name: 'Airtel Payments Bank', ifscPrefix: 'AIRP' },
    { id: 'fino', name: 'Fino Payments Bank', ifscPrefix: 'FINO' }
  ],
  'Small Finance Banks': [
    { id: 'au', name: 'AU Small Finance Bank', ifscPrefix: 'AUBL' },
    { id: 'equitas', name: 'Equitas Small Finance Bank', ifscPrefix: 'ESFB' }
  ],
  'Payments Banks': [
    { id: 'ipost', name: 'India Post Payments Bank', ifscPrefix: 'IPOS' },
    { id: 'nsdl', name: 'NSDL Payments Bank', ifscPrefix: 'NSDL' }
  ],
  'Other Banks': [
    // This category is for manual entry - no predefined banks
  ]
};

export const mockBanks: Bank[] = Object.values(mockSupportedBanks).flat();

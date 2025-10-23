export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  customer: string;
  email: string;
  method: string;
  date: Date;
  orderId: string;
  fee: number;
  tax: number;
  net: number;
}

export interface Settlement {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'settled' | 'failed';
  date: Date;
  utr?: string;
  transactionCount: number;
  fee: number;
  tax: number;
  net: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  pendingSettlements: number;
  todayRevenue: number;
  todayTransactions: number;
}

// New interfaces for refund functionality
export interface Refund {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reason: string;
  requestedBy: string;
  requestedAt: Date;
  processedAt?: Date;
  refundMethod: 'original' | 'bank_transfer' | 'wallet';
  bankDetails?: BankDetails;
}

export interface BankDetails {
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
}

// Dispute and chargeback interfaces
export interface Dispute {
  id: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'open' | 'investigating' | 'resolved' | 'won' | 'lost';
  reason: string;
  evidence?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  chargebackId?: string;
}

export interface Chargeback {
  id: string;
  disputeId: string;
  amount: number;
  currency: string;
  status: 'initiated' | 'representment' | 'accepted' | 'rejected';
  initiatedAt: Date;
  dueDate: Date;
  response?: string;
  documents?: string[];
}

// Payout interfaces
export interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  bankDetails: BankDetails;
  requestedAt: Date;
  processedAt?: Date;
  referenceId?: string;
  fee?: number;
  netAmount?: number;
}

export interface PayoutRequest {
  amount: number;
  bankDetails: BankDetails;
  notes?: string;
}

// Bank list for payout selection
export interface Bank {
  id: string;
  name: string;
  ifscPrefix: string;
  logo?: string;
}

export interface SupportedBanks {
  [category: string]: Bank[];
}

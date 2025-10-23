import { DashboardStats, Transaction, Settlement, Refund, Dispute, Chargeback, Payout } from '@/types/payment';

// Utility functions for user identification
export const TEST_USER_EMAIL = 'test@rivafincorp.com';

export const isTestUser = (userEmail: string | undefined): boolean => {
  return userEmail === TEST_USER_EMAIL;
};

// Empty data for non-test users
export const emptyStats: DashboardStats = {
  totalRevenue: 0,
  totalTransactions: 0,
  successRate: 0,
  pendingSettlements: 0,
  todayRevenue: 0,
  todayTransactions: 0
};

export const emptyTransactions: Transaction[] = [];
export const emptySettlements: Settlement[] = [];
export const emptyRefunds: Refund[] = [];
export const emptyDisputes: Dispute[] = [];
export const emptyChargebacks: Chargeback[] = [];
export const emptyPayouts: Payout[] = [];

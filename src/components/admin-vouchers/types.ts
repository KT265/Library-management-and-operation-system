export type VoucherDiscountType = 'percent' | 'fixed' | 'shipping';
export type VoucherStatusType = 'active' | 'expiring' | 'expired';

export interface AdminVoucher {
  id: string;
  code: string;
  campaign: string;
  description: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  discountLabel: string;
  conditionNote: string;
  usedCount: number;
  totalUsageLimit: number;
  expiryDate: string;
  expiryNote: string;
  status: VoucherStatusType;
  minSpend?: number;
  startDate?: string;
  isPerUser?: boolean;
  canCombine?: boolean;
}

export interface VoucherFilterOptions {
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'expiring' | 'expired';
  typeFilter: 'all' | 'fixed' | 'percent' | 'shipping';
}

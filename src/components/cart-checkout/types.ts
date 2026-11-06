export interface RecipientInfo {
  name: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  addressType: 'Primary Residence' | 'Office';
  isDefault: boolean;
}

export interface AppliedVoucher {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
}

export type ShippingTier = 'standard' | 'express';
export type PaymentMethod = 'cod' | 'vietqr';

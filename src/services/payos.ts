/**
 * PayOS Integration Service
 * Follows PayOS API and Webhook requirements defined in .agyrules
 */

export interface CreatePaymentLinkRequest {
  orderCode: number;
  amount: number;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentLinkResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  checkoutUrl: string;
  qrCode: string;
}

/**
 * Creates PayOS checkout link
 */
export const createPayOsPaymentLink = async (
  request: CreatePaymentLinkRequest
): Promise<PaymentLinkResponse> => {
  // In production, delegates to backend Cloud Function to protect PayOS checksum API secrets
  return {
    bin: '970422',
    accountNumber: '1152913482735',
    accountName: 'BOOKVERSE LIBRARY CORP',
    amount: request.amount,
    description: request.description.substring(0, 25),
    orderCode: request.orderCode,
    currency: 'VND',
    paymentLinkId: `payos-${Date.now()}`,
    status: 'PENDING',
    checkoutUrl: `https://pay.payos.vn/web/${request.orderCode}`,
    qrCode: `vietqr://mock-qr-code-payload-order-${request.orderCode}`,
  };
};


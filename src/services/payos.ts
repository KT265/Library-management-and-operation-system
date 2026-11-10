/**
 * PayOS Integration Service
 * Connects frontend payment triggers to backend PayOS endpoints on port 5000
 */
import { getFirebaseIdToken } from './firebase';
import { useStore } from '../store/useStore';

export interface CreatePaymentLinkParams {
  docId?: string;
  totalPrice?: number;
  cancelUrl?: string;
  returnUrl?: string;
  idToken?: string;

  // Legacy compatibility fields
  orderCode?: number;
  amount?: number;
  description?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export type CreatePaymentLinkRequest = CreatePaymentLinkParams;

export interface PaymentLinkResponse {
  bin?: string;
  accountNumber?: string;
  accountName?: string;
  amount?: number;
  description?: string;
  orderCode: number;
  currency?: string;
  paymentLinkId?: string;
  status?: 'PENDING' | 'PAID' | 'CANCELLED' | string;
  checkoutUrl: string;
  qrCode?: string;
  [key: string]: any;
}

/**
 * Resolves authentication Bearer token from parameter, Firebase Auth, or Zustand store
 */
export async function resolveAuthToken(explicitToken?: string): Promise<string | null> {
  if (explicitToken && explicitToken.trim()) {
    return explicitToken.trim();
  }

  try {
    const fbToken = await getFirebaseIdToken();
    if (fbToken && fbToken.trim()) {
      return fbToken.trim();
    }
  } catch (err) {
    console.warn('[PayOS Service] Notice: Could not acquire Firebase ID token:', err);
  }

  const storeToken = useStore.getState().idToken;
  if (storeToken && storeToken.trim()) {
    return storeToken.trim();
  }

  return null;
}

const BACKEND_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) ||
  'http://localhost:5000';

/**
 * Creates PayOS checkout link via backend API
 * Sends POST /api/payment/create-payment-link (with fallback to /api/payment/create-link)
 */
export const createPayOsPaymentLink = async (
  request: CreatePaymentLinkParams
): Promise<PaymentLinkResponse> => {
  const token = await resolveAuthToken(request.idToken);

  const docId = request.docId || (request.orderCode ? String(request.orderCode) : `ord-${Date.now()}`);
  const totalPrice = request.totalPrice ?? request.amount ?? 0;
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost:5173';
  const cancelUrl = request.cancelUrl || `${origin}/payment-cancel`;
  const returnUrl = request.returnUrl || `${origin}/payment-success`;

  const payload = {
    docId,
    totalPrice,
    cancelUrl,
    returnUrl,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BACKEND_BASE_URL}/api/payment/create-payment-link`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (response.status === 404) {
      response = await fetch(`${BACKEND_BASE_URL}/api/payment/create-link`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
    }
  } catch (netErr: any) {
    console.error('[PayOS Service] Network connection error:', netErr);
    throw new Error(
      `Không thể kết nối đến máy chủ thanh toán (${BACKEND_BASE_URL}). Vui lòng kiểm tra dịch vụ backend.`
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody.message ||
      errorBody.error ||
      `Tạo liên kết thanh toán thất bại với mã lỗi HTTP ${response.status}`;
    throw new Error(message);
  }

  const data = (await response.json()) as PaymentLinkResponse;
  if (!data || !data.checkoutUrl) {
    throw new Error('Dữ liệu phản hồi từ cổng thanh toán PayOS không hợp lệ.');
  }

  return data;
};

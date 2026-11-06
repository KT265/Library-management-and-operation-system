/**
 * Firebase Service Configuration & Modular SDK Stubs (v9+)
 * Strictly isolated inside /src/services as dictated by .agyrules
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyMockKeyForFrontendScaffolding',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'bookverse-library.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'bookverse-library',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'bookverse-library.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

// Database operation helpers respecting NoSQL denormalization rules
export interface DenormalizedOrderDocument {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string; // Embedded directly to avoid SQL JOINs
  userEmail: string;
  bookTitles: string[]; // Denormalized quick index
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  payOsOrderCode?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Real-time transaction listener stub (wrapper around Firestore onSnapshot)
 */
export const listenToTransactionStatus = (
  transactionId: string,
  onUpdate: (status: string) => void
): (() => void) => {
  console.log(`[Firestore onSnapshot] Listening to transaction: ${transactionId}`);
  onUpdate('pending');
  // In production, uses onSnapshot(doc(db, "transactions", transactionId), ...)
  const interval = setInterval(() => {
    onUpdate('paid');
  }, 5000);
  return () => clearInterval(interval);
};

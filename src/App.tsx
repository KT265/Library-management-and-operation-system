import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider, CssBaseline } from '@mui/material';
import { m3Theme } from './theme';
import { useStore } from './store/useStore';
import {
  subscribeToAuthChanges,
  lookupUserRoleAndProfile,
  mapFirebaseUserToUser,
} from './services/firebase';

// Layout Shells
import { StorefrontLayout } from './layouts/StorefrontLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Storefront Pages
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { BookDetails } from './pages/BookDetails';
import { CartCheckout } from './pages/CartCheckout';
import { UserProfile } from './pages/UserProfile';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentCancel } from './pages/PaymentCancel';

// Auth Pages
import { Auth } from './pages/Auth';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminInventory } from './pages/AdminInventory';
import { AdminOrders } from './pages/AdminOrders';
import { AdminVouchers } from './pages/AdminVouchers';
import { AdminUsers } from './pages/AdminUsers';

export const App: React.FC = () => {
  const { setAuth, setAuthLoading } = useStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setAuthLoading(true);
    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      try {
        if (fbUser) {
          const idToken = await fbUser.getIdToken();
          const { role, firestoreData } = await lookupUserRoleAndProfile(fbUser.uid, fbUser.email);
          const mappedUser = mapFirebaseUserToUser(fbUser, role, firestoreData);
          setAuth(mappedUser, idToken);
        } else {
          const currentUser = useStore.getState().user;
          if (import.meta.env?.DEV && currentUser?._isSimulated) {
            // Retain simulated session for local development / test runners only
          } else {
            setAuth(null, null);
          }
        }
      } catch (err) {
        console.error('[AuthListener] Error resolving session:', err);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setAuth, setAuthLoading]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={m3Theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Storefront Layout Routes */}
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/cart" element={<CartCheckout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancel" element={<PaymentCancel />} />

              {/* Protected Storefront Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<CartCheckout />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/orders" element={<UserProfile />} />
              </Route>
            </Route>

            {/* Auth Routes (Standalone) */}
            <Route path="/login" element={<Auth initialMode="signin" />} />
            <Route path="/register" element={<Auth initialMode="register" />} />
            <Route path="/auth" element={<Auth />} />

            {/* Admin Layout Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<Navigate to="/admin" replace />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="vouchers" element={<AdminVouchers />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="permissions" element={<Navigate to="/admin/users" replace />} />
                <Route path="roles" element={<Navigate to="/admin/users" replace />} />
              </Route>
            </Route>

            {/* Wildcard Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider, CssBaseline } from '@mui/material';
import { m3Theme } from './theme';

// Layout Shells
import { StorefrontLayout } from './layouts/StorefrontLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Storefront Pages
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { BookDetails } from './pages/BookDetails';
import { CartCheckout } from './pages/CartCheckout';
import { UserProfile } from './pages/UserProfile';

// Auth Pages
import { Auth } from './pages/Auth';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminInventory } from './pages/AdminInventory';
import { AdminOrders } from './pages/AdminOrders';
import { AdminVouchers } from './pages/AdminVouchers';
import { AdminUsers } from './pages/AdminUsers';

export const App: React.FC = () => {
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
              <Route path="/checkout" element={<CartCheckout />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/orders" element={<UserProfile />} />
            </Route>

            {/* Auth Routes (Standalone) */}
            <Route path="/login" element={<Auth initialMode="signin" />} />
            <Route path="/register" element={<Auth initialMode="register" />} />
            <Route path="/auth" element={<Auth />} />

            {/* Admin Layout Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="vouchers" element={<AdminVouchers />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="permissions" element={<Navigate to="/admin/users" replace />} />
              <Route path="roles" element={<Navigate to="/admin/users" replace />} />
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

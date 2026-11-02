import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { m3Theme } from './theme';
import { UserLayout } from './components/UserLayout';
import { AdminLayout } from './components/AdminLayout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { BookDetails } from './pages/BookDetails';
import { AdminVoucherManagement } from './pages/AdminVoucherManagement';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={m3Theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Storefront / User Facing Routes */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/book/:id" element={<BookDetails />} />
          </Route>

          {/* Admin Management Studio Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="vouchers" element={<AdminVoucherManagement />} />
            <Route path="inventory" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;


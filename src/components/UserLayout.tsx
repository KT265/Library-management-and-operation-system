import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { StorefrontHeader } from './StorefrontHeader';
import { FloatingCartDrawer } from './FloatingCartDrawer';
import { Footer } from './Footer';

export const UserLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Sticky / Fixed Navigation Header */}
      <StorefrontHeader />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: '80px', // Header offset
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Box>

      {/* Slide-over Cart Drawer with Max 10 items internal scroll logic */}
      <FloatingCartDrawer />

      {/* Editorial Commerce Footer */}
      <Footer />
    </Box>
  );
};


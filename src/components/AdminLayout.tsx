import React from 'react';
import { Box, Typography, Stack, IconButton, InputBase, Avatar } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useStore } from '../store/useStore';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area (Offset by sidebar width 288px) */}
      <Box
        sx={{
          flex: 1,
          pl: { xs: 0, md: '288px' },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Admin Header Bar */}
        <Box
          component="header"
          sx={{
            position: 'fixed',
            top: 0,
            left: { xs: 0, md: '288px' },
            right: 0,
            height: 80,
            bgcolor: 'rgba(248, 250, 252, 0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid #d9e2ec',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 4 },
          }}
        >
          {/* Quick Search in Admin */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#ffffff',
              borderRadius: 9999,
              px: 2,
              py: 0.6,
              width: { xs: '100%', sm: 360 },
              border: '1px solid #d9e2ec',
              boxShadow: '0 1px 3px rgba(26,54,93,0.03)',
            }}
          >
            <Box
              component="span"
              className="material-symbols-outlined"
              sx={{ fontSize: 18, color: '#727782', mr: 1 }}
            >
              search
            </Box>
            <InputBase
              placeholder="Search vouchers, ISBNs, orders..."
              sx={{ flex: 1, fontSize: '0.875rem' }}
            />
          </Box>

          {/* Quick Action Icons & Admin Profile */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              sx={{
                width: 38,
                height: 38,
                bgcolor: '#f1f5f9',
                color: 'text.secondary',
                '&:hover': { bgcolor: '#e2e8f0' },
              }}
            >
              <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                notifications
              </Box>
            </IconButton>

            <IconButton
              onClick={() => navigate('/')}
              sx={{
                width: 38,
                height: 38,
                bgcolor: '#f1f5f9',
                color: 'text.secondary',
                '&:hover': { bgcolor: '#e2e8f0' },
              }}
              title="View Storefront"
            >
              <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                storefront
              </Box>
            </IconButton>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0) || 'A'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  Curator Admin
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Super Admin
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* Admin Page Content */}
        <Box
          sx={{
            flex: 1,
            pt: '80px', // header height
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: 1440,
            width: '100%',
            mx: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};


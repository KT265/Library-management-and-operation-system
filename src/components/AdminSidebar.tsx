import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard Overview', path: '/admin', icon: 'dashboard' },
  { label: 'Book Inventory', path: '/admin/inventory', icon: 'inventory_2' },
  { label: 'Order Fulfillment', path: '/admin/orders', icon: 'local_shipping' },
  { label: 'Voucher Management', path: '/admin/vouchers', icon: 'local_offer' },
];

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useStore();

  return (
    <Box
      component="aside"
      sx={{
        width: 288,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: '#f1f5f9',
        borderRight: '1px solid #d9e2ec',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 3,
        zIndex: 1200,
        boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Brand Header */}
        <Box
          onClick={() => navigate('/admin')}
          sx={{
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'secondaryContainer.main',
              color: 'secondaryContainer.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 22 }}>
              menu_book
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1.1 }}>
              BookVerse
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Management Studio
            </Typography>
          </Box>
        </Box>

        {/* Storefront / Admin Switcher Pill */}
        <Box sx={{ px: 2 }}>
          <Stack
            direction="row"
            sx={{
              p: '4px',
              borderRadius: 9999,
              bgcolor: '#eaeff5',
            }}
          >
            <Button
              onClick={() => navigate('/')}
              sx={{
                flex: 1,
                py: 0.6,
                borderRadius: 9999,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
              }}
              startIcon={
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 16 }}>
                  storefront
                </Box>
              }
            >
              Storefront
            </Button>
            <Button
              onClick={() => navigate('/admin/vouchers')}
              sx={{
                flex: 1,
                py: 0.6,
                borderRadius: 9999,
                fontSize: '0.75rem',
                fontWeight: 700,
                bgcolor: 'primary.main',
                color: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: 'primary.light' },
              }}
              startIcon={
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 16 }}>
                  admin_panel_settings
                </Box>
              }
            >
              Admin
            </Button>
          </Stack>
        </Box>

        {/* Navigation Section */}
        <Box>
          <Box sx={{ px: 3, mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#727782',
                fontSize: '0.7rem',
              }}
            >
              Core Management
            </Typography>
          </Box>

          <Stack spacing={0.8} sx={{ px: 2 }}>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2,
                    py: 1.2,
                    borderRadius: 9999,
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    bgcolor: isActive ? 'secondaryContainer.main' : 'transparent',
                    color: isActive ? 'secondaryContainer.contrastText' : 'text.secondary',
                    boxShadow: isActive ? '0 1px 3px rgba(26,54,93,0.06)' : 'none',
                    '&:hover': {
                      bgcolor: isActive ? 'secondaryContainer.main' : '#e2e8f0',
                      color: isActive ? 'secondaryContainer.contrastText' : 'text.primary',
                    },
                  }}
                  startIcon={
                    <Box
                      component="span"
                      className="material-symbols-outlined"
                      sx={{
                        fontSize: 20,
                        fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0',
                      }}
                    >
                      {item.icon}
                    </Box>
                  }
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Box>

      {/* Admin Profile Footer */}
      <Box sx={{ px: 2.5 }}>
        <Divider sx={{ mb: 2, borderColor: '#d9e2ec' }} />
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            A
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}
            >
              {user?.role === 'admin' ? user.name : 'Curator Admin'}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: 'text.secondary', display: 'block' }}
            >
              ops@bookverse.io
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};


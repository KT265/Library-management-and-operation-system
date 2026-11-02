import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  InputBase,
  Button,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const StorefrontHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    switchRole,
    searchQuery,
    setSearchQuery,
    openCart,
    getTotalCount,
  } = useStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const totalCartCount = getTotalCount();

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        zIndex: 1100,
        bgcolor: 'rgba(248, 249, 253, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(217, 226, 236, 0.6)',
        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, sm: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1440,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left: Brand Logo & Main Navigation Pills */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ flexShrink: 0 }}>
          <Box
            component="div"
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover .logo-icon': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Box
              className="logo-icon"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'secondaryContainer.main',
                color: 'secondaryContainer.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
              }}
            >
              <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 22 }}>
                menu_book
              </Box>
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: 'primary.main',
                letterSpacing: '-0.02em',
              }}
            >
              BookVerse
            </Typography>
          </Box>

          {/* Navigation Pills */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: 'none', md: 'flex' },
              p: '4px',
              borderRadius: 9999,
              bgcolor: 'surfaceContainerLow',
            }}
          >
            <Button
              onClick={() => navigate('/')}
              sx={{
                px: 2.5,
                py: 0.6,
                borderRadius: 9999,
                fontSize: '0.875rem',
                fontWeight: location.pathname === '/' ? 700 : 500,
                bgcolor: location.pathname === '/' ? 'secondaryContainer.main' : 'transparent',
                color: location.pathname === '/' ? 'secondaryContainer.contrastText' : 'text.secondary',
                '&:hover': {
                  bgcolor: location.pathname === '/' ? 'secondaryContainer.main' : 'surfaceContainerHigh',
                  color: 'text.primary',
                },
              }}
            >
              Home
            </Button>
            <Button
              onClick={() => navigate('/catalog')}
              sx={{
                px: 2.5,
                py: 0.6,
                borderRadius: 9999,
                fontSize: '0.875rem',
                fontWeight: location.pathname.startsWith('/catalog') ? 700 : 500,
                bgcolor: location.pathname.startsWith('/catalog') ? 'secondaryContainer.main' : 'transparent',
                color: location.pathname.startsWith('/catalog') ? 'secondaryContainer.contrastText' : 'text.secondary',
                '&:hover': {
                  bgcolor: location.pathname.startsWith('/catalog') ? 'secondaryContainer.main' : 'surfaceContainerHigh',
                  color: 'text.primary',
                },
              }}
            >
              Catalog
            </Button>
          </Stack>
        </Stack>

        {/* Center: Global Search Input Field */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flex: 1,
            maxWidth: 520,
            mx: 2,
            alignItems: 'center',
            bgcolor: '#ffffff',
            borderRadius: 9999,
            px: 2,
            py: 0.5,
            border: '1px solid #d9e2ec',
            boxShadow: '0 1px 3px rgba(26, 54, 93, 0.04)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:focus-within': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 3px rgba(26, 54, 93, 0.1)',
            },
          }}
        >
          <Box
            component="span"
            className="material-symbols-outlined"
            sx={{ fontSize: 20, color: 'text.secondary', mr: 1.5 }}
          >
            search
          </Box>
          <InputBase
            placeholder="Search titles, authors, ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && location.pathname !== '/catalog') {
                navigate('/catalog');
              }
            }}
            sx={{
              flex: 1,
              fontSize: '0.9rem',
              color: 'text.primary',
              fontFamily: 'inherit',
            }}
          />
          <Box
            component="button"
            onClick={() => navigate('/catalog')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: 0.4,
              borderRadius: 9999,
              bgcolor: 'surfaceContainer',
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'surfaceContainerHigh',
                color: 'text.primary',
              },
            }}
          >
            <span>All Genres</span>
            <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 14 }}>
              expand_more
            </Box>
          </Box>
        </Box>

        {/* Right: Quick Role Switch & Reading Bag & User Profile */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexShrink: 0 }}>
          {/* Storefront / Admin Switch Pill */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              p: '3px',
              borderRadius: 9999,
              bgcolor: 'surfaceContainerHigh',
            }}
          >
            <Button
              size="small"
              onClick={() => navigate('/')}
              sx={{
                px: 1.5,
                py: 0.3,
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 9999,
                bgcolor: 'primary.main',
                color: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: 'primary.light' },
              }}
              startIcon={
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 15 }}>
                  storefront
                </Box>
              }
            >
              Storefront
            </Button>
            <Button
              size="small"
              onClick={() => navigate('/admin/vouchers')}
              sx={{
                px: 1.5,
                py: 0.3,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 9999,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
              }}
              startIcon={
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 15 }}>
                  admin_panel_settings
                </Box>
              }
            >
              Admin
            </Button>
          </Stack>

          {/* Quick Bag Button */}
          <IconButton
            onClick={openCart}
            aria-label="Open Reading Bag"
            sx={{
              position: 'relative',
              width: 42,
              height: 42,
              color: 'primary.main',
              bgcolor: 'surfaceContainerLow',
              '&:hover': { bgcolor: 'surfaceContainer' },
            }}
          >
            <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 22 }}>
              shopping_bag
            </Box>
            {totalCartCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 18,
                  height: 18,
                  px: '4px',
                  borderRadius: 9999,
                  bgcolor: 'tertiary.main',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalCartCount}
              </Box>
            )}
          </IconButton>

          {/* Profile Button */}
          <IconButton
            onClick={handleMenuClick}
            sx={{
              p: 0,
              border: '2px solid',
              borderColor: 'secondaryContainer.main',
            }}
          >
            <Avatar
              alt={user?.name || 'User'}
              src={user?.avatar}
              sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          {/* Profile Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                width: 240,
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(26, 54, 93, 0.15)',
                border: '1px solid #e2e8f0',
                p: 1,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {user?.name || 'Guest User'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {user?.email || 'guest@bookverse.io'}
              </Typography>
              <Box
                sx={{
                  mt: 0.8,
                  display: 'inline-block',
                  px: 1,
                  py: 0.2,
                  borderRadius: 9999,
                  bgcolor: 'secondaryContainer.main',
                  color: 'secondaryContainer.contrastText',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {user?.role}
              </Box>
            </Box>
            <Divider sx={{ my: 1, borderColor: '#eaeff5' }} />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/catalog');
              }}
              sx={{ borderRadius: '8px', fontSize: '0.875rem' }}
            >
              <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }}>
                book
              </Box>
              Browse Catalog
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/admin/vouchers');
              }}
              sx={{ borderRadius: '8px', fontSize: '0.875rem' }}
            >
              <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }}>
                admin_panel_settings
              </Box>
              Admin Dashboard
            </MenuItem>
            <MenuItem
              onClick={() => {
                switchRole(user?.role === 'admin' ? 'customer' : 'admin');
                handleMenuClose();
              }}
              sx={{ borderRadius: '8px', fontSize: '0.875rem' }}
            >
              <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }}>
                swap_horiz
              </Box>
              Switch to {user?.role === 'admin' ? 'Customer' : 'Admin'} Mode
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
    </Box>
  );
};


import React from 'react';
import { Box, Typography, Stack, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#eaeff5',
        borderTop: '1px solid #d9e2ec',
        pt: 8,
        pb: 5,
        px: { xs: 2.5, sm: 4, md: 6 },
        mt: 'auto',
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: 'secondaryContainer.main',
                  color: 'secondaryContainer.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                  menu_book
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                BookVerse
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360, mb: 2 }}>
              Balancing an inviting, sensory storefront for readers and bibliophiles with a rigorous, data-dense management interface for curators and booksellers.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 9999,
                  bgcolor: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'primary.main',
                  border: '1px solid #d9e2ec',
                }}
              >
                Material Design 3
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 9999,
                  bgcolor: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'tertiary.main',
                  border: '1px solid #ffdbcf',
                }}
              >
                Autumn Gala 2026
              </Box>
            </Stack>
          </Grid>

          {/* Discover */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
              Discover
            </Typography>
            <Stack spacing={1}>
              {['Literary Fiction', 'Tech & Coding', 'Sci-Fi & Fantasy', 'Distributed Systems', 'Nobel Laureates'].map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  onClick={() => navigate('/catalog')}
                  sx={{
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' },
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Reader Services */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
              Reader Services
            </Typography>
            <Stack spacing={1}>
              {['Complimentary Dispatch', 'Reading Bag', 'Order Tracking', 'Gift Editions', 'Support & FAQ'].map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' },
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Operations */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
              Operations & Admin
            </Typography>
            <Stack spacing={1}>
              <Typography
                variant="body2"
                onClick={() => navigate('/admin/vouchers')}
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                <span>Voucher Management</span>
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 16 }}>
                  arrow_forward
                </Box>
              </Typography>
              <Typography
                variant="body2"
                onClick={() => navigate('/admin/vouchers')}
                sx={{
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Dashboard Overview
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Inventory Fulfillment
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                PayOS Webhook Status (Active)
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#d9e2ec', mb: 3 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © 2026 BookVerse Editorial Commerce. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Built with React, TypeScript, Material-UI v5 & Zustand.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};


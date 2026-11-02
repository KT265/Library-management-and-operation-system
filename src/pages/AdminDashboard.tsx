import React from 'react';
import { Box, Typography, Stack, Grid, Card, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', pb: 8 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'flex-end' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.02em', mb: 0.5 }}
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Real-time bookstore operational metrics, inventory turnover, and fulfillment dispatch.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate('/admin/vouchers')}
          sx={{
            borderRadius: 9999,
            px: 3,
            bgcolor: 'primary.main',
            fontWeight: 700,
          }}
          startIcon={
            <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
              local_offer
            </Box>
          }
        >
          Manage Vouchers
        </Button>
      </Stack>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Catalog Volumes', value: '4,840', sub: 'Across 6 genres', icon: 'menu_book', color: 'primary.main' },
          { label: 'Active Monthly Orders', value: '1,289', sub: '+12.4% vs last month', icon: 'local_shipping', color: '#065f46' },
          { label: 'Total Revenue (PayOS)', value: '$64,280', sub: '100% verified settlement', icon: 'payments', color: 'primary.main' },
          { label: 'Voucher Campaigns', value: '8 Active', sub: 'Redemption rate 38%', icon: 'confirmation_number', color: 'tertiary.main' },
        ].map((m, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Card
              sx={{
                p: 3,
                borderRadius: '20px',
                bgcolor: '#ffffff',
                border: '1px solid #eaeff5',
                boxShadow: '0 1px 3px rgba(26,54,93,0.04)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: '0.06em' }}>
                  {m.label}
                </Typography>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    bgcolor: 'secondaryContainer.main',
                    color: m.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                    {m.icon}
                  </Box>
                </Box>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mt: 2 }}>
                {m.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {m.sub}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Operational Highlights Box */}
      <Box
        sx={{
          p: 4,
          borderRadius: '24px',
          bgcolor: '#ffffff',
          border: '1px solid #eaeff5',
          boxShadow: '0 1px 4px rgba(26,54,93,0.04)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          System Integrations & PayOS Real-Time Status
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Adhering to .agyrules architecture: Firebase Cloud Functions handle PayOS webhooks with SHA256 checksum verification, and Firestore onSnapshot listeners keep frontend states synchronized in real-time.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/vouchers')}
            sx={{ borderRadius: 9999, fontWeight: 700 }}
          >
            Open Voucher Management
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ borderRadius: 9999, bgcolor: 'primary.main', fontWeight: 700 }}
          >
            Preview Storefront
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};


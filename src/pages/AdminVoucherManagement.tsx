import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  Card,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Switch,
  LinearProgress,
} from '@mui/material';
import { MOCK_VOUCHERS } from '../data/mockData';
import { Voucher, VoucherDiscountType } from '../types';

export const AdminVoucherManagement: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'expired'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State for Create Voucher
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<VoucherDiscountType>('percentage');
  const [newValue, setNewValue] = useState<number>(15);
  const [newMinSpend, setNewMinSpend] = useState<number>(50);
  const [newLimit, setNewLimit] = useState<number>(500);
  const [newExpiry, setNewExpiry] = useState('2026-12-31');
  const [newCategory, setNewCategory] = useState('All Catalog');
  const [newDesc, setNewDesc] = useState('');

  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const created: Voucher = {
      id: `vouch-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      discountType: newType,
      discountValue: Number(newValue),
      minSpend: Number(newMinSpend),
      totalUsageLimit: Number(newLimit),
      usedCount: 0,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: newExpiry,
      status: 'active',
      description: newDesc || `${newValue}${newType === 'percentage' ? '%' : '$'} promotional coupon.`,
      applicableCategory: newCategory,
    };

    setVouchers([created, ...vouchers]);
    setIsCreateOpen(false);
    // Reset form
    setNewCode('');
    setNewDesc('');
  };

  const handleToggleStatus = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const newStatus = v.status === 'active' ? 'expired' : 'active';
        return { ...v, status: newStatus };
      })
    );
  };

  const handleDelete = (id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  const filteredVouchers = vouchers.filter((v) => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.code.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        (v.applicableCategory && v.applicableCategory.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeCount = vouchers.filter((v) => v.status === 'active').length;
  const totalRedemptions = vouchers.reduce((acc, v) => acc + v.usedCount, 0);

  return (
    <Box sx={{ width: '100%', pb: 8 }}>
      {/* Top Action Header */}
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
            Voucher & Promotion Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 600 }}>
            Create discount rules, track redemption rates, and configure promo campaigns across BookVerse editions.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenCreate}
          sx={{
            height: 44,
            px: 3,
            borderRadius: 9999,
            bgcolor: 'primary.main',
            fontSize: '0.9rem',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(26,54,93,0.2)',
            '&:hover': {
              bgcolor: 'primary.light',
              '& .add-icon': { transform: 'rotate(90deg)' },
            },
          }}
          startIcon={
            <Box
              component="span"
              className="material-symbols-outlined add-icon"
              sx={{ fontSize: 20, transition: 'transform 0.25s ease' }}
            >
              add
            </Box>
          }
        >
          Create New Voucher
        </Button>
      </Stack>

      {/* Key Metrics Bento Row */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
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
                Active Vouchers
              </Typography>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  bgcolor: 'secondaryContainer.main',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                  confirmation_number
                </Box>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {activeCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                active rules
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
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
                Total Redemptions
              </Typography>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  bgcolor: 'primaryContainer.main',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                  shopping_bag
                </Box>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {totalRedemptions.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                orders claimed
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
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
                Discount Distributed
              </Typography>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  bgcolor: 'tertiaryContainer.main',
                  color: 'tertiary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                  savings
                </Box>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                $14,250
              </Typography>
              <Typography variant="body2" sx={{ color: '#065f46', fontWeight: 700 }}>
                +18.4% MoM
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
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
                Conversion Lift
              </Typography>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  bgcolor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                  trending_up
                </Box>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                +24.8%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                vs non-promo
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Search Bar */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={2}
        sx={{
          bgcolor: '#f1f5f9',
          p: 2,
          px: 2.5,
          borderRadius: '20px',
          mb: 3,
        }}
      >
        {/* Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#ffffff',
            borderRadius: 9999,
            px: 2,
            py: 0.6,
            width: { xs: '100%', md: 360 },
            border: '1px solid #d9e2ec',
          }}
        >
          <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18, color: '#727782', mr: 1 }}>
            search
          </Box>
          <InputBase
            placeholder="Search code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, fontSize: '0.85rem' }}
          />
        </Box>

        {/* Status Filters */}
        <Stack direction="row" spacing={0.5} sx={{ bgcolor: '#eaeff5', p: '3px', borderRadius: 9999, overflowX: 'auto' }}>
          {[
            { id: 'all', label: `All (${vouchers.length})` },
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'expired', label: 'Expired' },
          ].map((tab) => (
            <Button
              key={tab.id}
              size="small"
              onClick={() => setStatusFilter(tab.id as any)}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 9999,
                fontSize: '0.8rem',
                fontWeight: statusFilter === tab.id ? 700 : 500,
                bgcolor: statusFilter === tab.id ? '#ffffff' : 'transparent',
                color: statusFilter === tab.id ? 'primary.main' : 'text.secondary',
                boxShadow: statusFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                '&:hover': { bgcolor: statusFilter === tab.id ? '#ffffff' : '#e2e8f0' },
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* Vouchers Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '20px',
          border: '1px solid #d9e2ec',
          boxShadow: '0 1px 3px rgba(26,54,93,0.04)',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Voucher Code
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Discount Value
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Min. Spend
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Redemption Progress
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Valid Until
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Status
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVouchers.map((voucher) => {
              const usagePercent = Math.min(100, Math.round((voucher.usedCount / voucher.totalUsageLimit) * 100));

              return (
                <TableRow
                  key={voucher.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: 'rgba(218, 226, 249, 0.2)' },
                    borderBottom: '1px solid #eaeff5',
                  }}
                >
                  {/* Code */}
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '8px',
                          bgcolor: 'secondaryContainer.main',
                          color: 'primary.main',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          letterSpacing: '0.05em',
                          fontFamily: 'monospace',
                        }}
                      >
                        {voucher.code}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => navigator.clipboard?.writeText(voucher.code)}
                        title="Copy code"
                        sx={{ color: '#727782' }}
                      >
                        <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 16 }}>
                          content_copy
                        </Box>
                      </IconButton>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, maxWidth: 220 }} noWrap>
                      {voucher.description}
                    </Typography>
                  </TableCell>

                  {/* Discount Value */}
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {voucher.discountType === 'percentage'
                        ? `${voucher.discountValue}% OFF`
                        : `$${voucher.discountValue.toFixed(2)} FLAT`}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {voucher.applicableCategory || 'All Catalog'}
                    </Typography>
                  </TableCell>

                  {/* Min Spend */}
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      ${voucher.minSpend.toFixed(2)}
                    </Typography>
                  </TableCell>

                  {/* Usage / Progress */}
                  <TableCell sx={{ minWidth: 160 }}>
                    <Stack spacing={0.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {voucher.usedCount} claimed
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Max {voucher.totalUsageLimit}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={usagePercent}
                        sx={{
                          height: 6,
                          borderRadius: 9999,
                          bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: usagePercent > 80 ? 'tertiary.main' : 'primary.main',
                            borderRadius: 9999,
                          },
                        }}
                      />
                    </Stack>
                  </TableCell>

                  {/* Expiry */}
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                      {voucher.expiryDate}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={voucher.status.toUpperCase()}
                      size="small"
                      sx={{
                        fontSize: '10px',
                        fontWeight: 700,
                        bgcolor:
                          voucher.status === 'active'
                            ? '#dcfce7'
                            : voucher.status === 'scheduled'
                            ? 'secondaryContainer.main'
                            : '#f1f5f9',
                        color:
                          voucher.status === 'active'
                            ? '#166534'
                            : voucher.status === 'scheduled'
                            ? 'primary.main'
                            : '#727782',
                      }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                      <Switch
                        size="small"
                        checked={voucher.status === 'active'}
                        onChange={() => handleToggleStatus(voucher.id)}
                        title="Toggle Active Status"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: 'primary.main' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'primary.main' },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(voucher.id)}
                        sx={{ color: '#727782', '&:hover': { color: 'error.main' } }}
                        title="Delete voucher"
                      >
                        <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18 }}>
                          delete_outline
                        </Box>
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create New Voucher Dialog */}
      <Dialog
        open={isCreateOpen}
        onClose={handleCloseCreate}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 1.5,
          },
        }}
      >
        <form onSubmit={handleSaveVoucher}>
          <DialogTitle sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.4rem' }}>
            Create New Voucher Rule
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: '#eaeff5' }}>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                label="Voucher Code"
                placeholder="e.g. WINTERGALA30"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                required
                fullWidth
                size="small"
                helperText="Code will automatically uppercase for readers"
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  label="Discount Type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as VoucherDiscountType)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                </TextField>

                <TextField
                  label={newType === 'percentage' ? 'Discount (%)' : 'Discount ($)'}
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  required
                  fullWidth
                  size="small"
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Min. Spend Threshold ($)"
                  type="number"
                  value={newMinSpend}
                  onChange={(e) => setNewMinSpend(Number(e.target.value))}
                  required
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Total Usage Cap"
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(Number(e.target.value))}
                  required
                  fullWidth
                  size="small"
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Expiry Date"
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  select
                  label="Applicable Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="All Catalog">All Catalog</MenuItem>
                  <MenuItem value="Featured Volumes">Featured Volumes</MenuItem>
                  <MenuItem value="Tech & Coding">Tech & Coding</MenuItem>
                  <MenuItem value="Literary Fiction">Literary Fiction</MenuItem>
                </TextField>
              </Stack>

              <TextField
                label="Campaign Description"
                placeholder="Brief campaign note for staff and reader display..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                multiline
                rows={2}
                fullWidth
                size="small"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseCreate} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: 9999,
                px: 3,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.light' },
              }}
            >
              Publish Voucher
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};


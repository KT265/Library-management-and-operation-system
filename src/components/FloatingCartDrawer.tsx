import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Checkbox,
  Drawer,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const FloatingCartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeFromCart,
    toggleItemSelection,
    getTotalCount,
    getSelectedSubtotal,
    seedDemoItems,
    hasMoreThanTenItems,
  } = useStore();

  const totalCount = getTotalCount();
  const selectedSubtotal = getSelectedSubtotal();
  const isScrollCapped = hasMoreThanTenItems();

  const handleCheckout = () => {
    closeCart();
    navigate('/catalog');
  };

  return (
    <>
      {/* Vertically centered Floating Action Button (FAB) at the right edge */}
      <Box
        component="button"
        onClick={openCart}
        aria-label="Open Reading Bag Drawer"
        sx={{
          position: 'fixed',
          right: { xs: 16, sm: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: '0 10px 25px -5px rgba(26, 54, 93, 0.35)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          transition: 'all 0.25s ease',
          '&:hover': {
            bgcolor: 'primary.light',
            transform: 'translateY(-50%) scale(1.08)',
          },
          '&:active': {
            transform: 'translateY(-50%) scale(0.95)',
          },
        }}
      >
        <Box
          component="span"
          className="material-symbols-outlined"
          sx={{ fontSize: 26 }}
        >
          shopping_bag
        </Box>

        {totalCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 22,
              height: 22,
              px: '5px',
              borderRadius: 9999,
              bgcolor: 'tertiary.main',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(200, 90, 50, 0.4)',
              lineHeight: 1,
            }}
          >
            {totalCount}
          </Box>
        )}
      </Box>

      {/* Slide-over Drawer Panel */}
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={closeCart}
        PaperProps={{
          sx: {
            width: { xs: '100vw', sm: 440 },
            maxWidth: '100vw',
            bgcolor: '#ffffff',
            boxShadow: '0 20px 25px -5px rgba(26, 54, 93, 0.2)',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Header (Sticky at top) */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            px: 3,
            py: 2,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #d9e2ec',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                bgcolor: 'secondaryContainer.main',
                color: 'secondaryContainer.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="span"
                className="material-symbols-outlined"
                sx={{ fontSize: 20 }}
              >
                shopping_bag
              </Box>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: 'primary.dark',
                  lineHeight: 1.2,
                }}
              >
                Your Reading Bag ({totalCount})
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block' }}
              >
                Review items before checkout
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={closeCart}
            size="small"
            aria-label="Close Bag"
            sx={{
              width: 36,
              height: 36,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: '#e2e8f0',
                color: 'text.primary',
              },
            }}
          >
            <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
              close
            </Box>
          </IconButton>
        </Box>

        {/* Info Banner for Max 10 Items Scroll Logic */}
        <Box
          sx={{
            px: 3,
            py: 1,
            bgcolor: isScrollCapped ? '#ffdbcf' : '#f1f5f9',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: isScrollCapped ? '#822801' : 'text.secondary',
            }}
          >
            {isScrollCapped
              ? `Internal Scroll Active (${cartItems.length} items > 10 cap)`
              : `${cartItems.length} of 10 free-flow capacity`}
          </Typography>
          <Button
            size="small"
            variant="text"
            onClick={() => seedDemoItems(isScrollCapped ? 3 : 12)}
            sx={{
              p: 0,
              fontSize: '11px',
              minWidth: 'auto',
              color: 'primary.main',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            {isScrollCapped ? 'Reset to 3 Items' : 'Test >10 Items'}
          </Button>
        </Box>

        {/* List Container: Dynamic height growing with content, strictly capped at max 10 books (~740px or calc(10 * 74px)) */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: 'calc(10 * 74px)',
            px: 2.5,
            py: 1.5,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: '#f1f5f9',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#c2c7d0',
              borderRadius: '9999px',
            },
          }}
        >
          {cartItems.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Box
                component="span"
                className="material-symbols-outlined"
                sx={{ fontSize: 48, color: '#c2c7d0', mb: 1, display: 'block' }}
              >
                production_quantity_limits
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Your reading bag is empty
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  closeCart();
                  navigate('/catalog');
                }}
                sx={{ mt: 2, borderRadius: 9999 }}
              >
                Browse Catalog
              </Button>
            </Box>
          ) : (
            cartItems.map((item, index) => (
              <Box key={item.id}>
                {index > 0 && <Divider sx={{ my: 1.2, borderColor: '#eaeff5' }} />}
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ py: 0.8 }}
                >
                  <Checkbox
                    checked={item.selected}
                    onChange={() => toggleItemSelection(item.id)}
                    size="small"
                    sx={{
                      p: 0.5,
                      color: 'primary.main',
                      '&.Mui-checked': { color: 'primary.main' },
                    }}
                  />

                  {/* Book Cover Thumbnail */}
                  <Box
                    sx={{
                      width: 44,
                      height: 56,
                      borderRadius: '6px',
                      overflow: 'hidden',
                      bgcolor: '#e2e8f0',
                      flexShrink: 0,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Box
                      component="img"
                      src={item.coverImage}
                      alt={item.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  {/* Book Metadata & Controls */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      noWrap
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.875rem',
                        lineHeight: 1.25,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{
                        color: 'text.secondary',
                        display: 'block',
                        fontSize: '0.75rem',
                      }}
                    >
                      {item.author}
                    </Typography>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 0.5 }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          fontSize: '0.875rem',
                        }}
                      >
                        ${item.price.toFixed(2)}
                      </Typography>

                      {/* Quantity Selector */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                          bgcolor: '#f1f5f9',
                          borderRadius: 9999,
                          border: '1px solid #e2e8f0',
                          p: '2px',
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, -1)}
                          sx={{
                            width: 22,
                            height: 22,
                            p: 0,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: 'text.secondary',
                            '&:hover': { bgcolor: '#eaeff5' },
                          }}
                        >
                          -
                        </IconButton>
                        <Typography
                          variant="caption"
                          sx={{
                            width: 24,
                            textAlign: 'center',
                            fontWeight: 700,
                            color: 'text.primary',
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, 1)}
                          sx={{
                            width: 22,
                            height: 22,
                            p: 0,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: 'text.secondary',
                            '&:hover': { bgcolor: '#eaeff5' },
                          }}
                        >
                          +
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Remove Button */}
                  <IconButton
                    size="small"
                    onClick={() => removeFromCart(item.id)}
                    sx={{
                      p: 0.5,
                      color: '#727782',
                      '&:hover': { color: 'error.main' },
                    }}
                  >
                    <Box
                      component="span"
                      className="material-symbols-outlined"
                      sx={{ fontSize: 18 }}
                    >
                      delete_outline
                    </Box>
                  </IconButton>
                </Stack>
              </Box>
            ))
          )}
        </Box>

        {/* Footer (Sticky at bottom) */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            px: 3,
            py: 2.5,
            bgcolor: '#f1f5f9',
            borderTop: '1px solid #d9e2ec',
          }}
        >
          <Stack spacing={1.5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Delivery Note
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ fontSize: 16, color: '#065f46' }}
                >
                  local_shipping
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#065f46', fontWeight: 700 }}
                >
                  Free Shipping
                </Typography>
              </Stack>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Subtotal
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ${selectedSubtotal.toFixed(2)}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              disabled={cartItems.length === 0}
              onClick={handleCheckout}
              sx={{
                height: 48,
                borderRadius: 9999,
                bgcolor: 'primary.main',
                fontSize: '0.95rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(26, 54, 93, 0.25)',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              }}
              endIcon={
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ fontSize: 18 }}
                >
                  arrow_forward
                </Box>
              }
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={closeCart}
              sx={{
                py: 0.5,
                fontSize: '0.85rem',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'transparent',
                },
              }}
            >
              Continue Browsing
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};


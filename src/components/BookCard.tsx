import React from 'react';
import { Box, Typography, Button, Stack, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Book } from '../types';
import { useStore } from '../store/useStore';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book, 1);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: '24px',
        bgcolor: '#ffffff',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        border: '1px solid #eaeff5',
        boxShadow: '0 1px 3px rgba(26, 54, 93, 0.04)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -6px rgba(26, 54, 93, 0.12)',
        },
      }}
    >
      <Box>
        {/* Cover Stage */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '3/4',
            borderRadius: '16px',
            overflow: 'hidden',
            bgcolor: '#eaeff5',
            mb: 2,
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.04)',
          }}
        >
          <Box
            component="img"
            src={book.coverImage}
            alt={book.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          {book.isBestseller && (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                px: 1.5,
                py: 0.4,
                borderRadius: 9999,
                bgcolor: 'tertiary.main',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              Bestseller
            </Box>
          )}
        </Box>

        {/* Stock & Rating Metadata Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.2,
              py: 0.3,
              borderRadius: 9999,
              bgcolor: 'secondaryContainer.main',
              color: 'secondaryContainer.contrastText',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 13 }}>
              check_circle
            </Box>
            <span>In Stock</span>
          </Box>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
              component="span"
              className="material-symbols-outlined"
              sx={{ fontSize: 16, color: '#c85a32' }}
            >
              star
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {book.rating}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ({book.reviewCount})
            </Typography>
          </Stack>
        </Stack>

        {/* Title & Author */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            '&:hover': { color: 'primary.light' },
          }}
        >
          {book.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {book.author} • {book.publisher}
        </Typography>
      </Box>

      {/* Pricing & CTA Lockup */}
      <Box sx={{ pt: 1, borderTop: '1px solid #f1f5f9' }}>
        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
            ${book.price.toFixed(2)}
          </Typography>
          {book.originalPrice && (
            <Typography
              variant="caption"
              sx={{ color: '#727782', textDecoration: 'line-through' }}
            >
              ${book.originalPrice.toFixed(2)}
            </Typography>
          )}
        </Stack>

        <Stack spacing={1}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleBuyNow}
            sx={{
              height: 38,
              borderRadius: 9999,
              bgcolor: 'secondaryContainer.main',
              color: 'secondaryContainer.contrastText',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#c2d4f8',
                boxShadow: 'none',
              },
            }}
            startIcon={
              <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 17 }}>
                bolt
              </Box>
            }
          >
            Buy Now
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleAddToCart}
            sx={{
              height: 42,
              borderRadius: 9999,
              bgcolor: 'primary.main',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(26, 54, 93, 0.15)',
              '&:hover': {
                bgcolor: 'primary.light',
              },
            }}
            startIcon={
              <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18 }}>
                shopping_bag
              </Box>
            }
          >
            Add to Bag
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};


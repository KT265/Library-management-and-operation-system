import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  IconButton,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Avatar,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_BOOKS } from '../data/mockData';
import { BookCard } from '../components/BookCard';
import { useStore } from '../store/useStore';

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState('Paperback');

  const book = MOCK_BOOKS.find((b) => b.id === id) || MOCK_BOOKS[0];

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  const handleBuyNow = () => {
    addToCart(book, quantity);
  };

  // Related books (excluding current book)
  const relatedBooks = MOCK_BOOKS.filter((b) => b.id !== book.id).slice(0, 4);

  return (
    <Box sx={{ width: '100%', pb: 10 }}>
      <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, sm: 3, md: 5 } }}>
        {/* Breadcrumb Ribbon */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            py: 2.5,
            color: 'text.secondary',
            fontSize: '0.85rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 16 }}>
              home
            </Box>
            <span>Home</span>
          </Box>
          <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 14, color: '#727782' }}>
            chevron_right
          </Box>
          <Box
            onClick={() => navigate('/catalog')}
            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
          >
            {book.genre}
          </Box>
          <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 14, color: '#727782' }}>
            chevron_right
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.primary', maxWidth: 300 }}
            noWrap
          >
            {book.title}
          </Typography>
        </Stack>

        {/* Main Product Showcase Grid */}
        <Grid container spacing={5} alignItems="flex-start" sx={{ mb: 8 }}>
          {/* Left Column: Visual Gallery Stage */}
          <Grid item xs={12} lg={5}>
            <Box
              sx={{
                position: 'relative',
                bgcolor: '#f1f5f9',
                borderRadius: '24px',
                p: { xs: 3, sm: 5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 1px 4px rgba(26,54,93,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* Ambient Glow */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -60,
                  left: -60,
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  bgcolor: 'rgba(218, 226, 249, 0.45)',
                  filter: 'blur(50px)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -60,
                  right: -60,
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 219, 207, 0.35)',
                  filter: 'blur(50px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Book Cover Container with 3D drop-shadow */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 320,
                  aspectRatio: '3/4',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(26, 54, 93, 0.35)',
                  mb: 4,
                  transition: 'transform 0.4s ease',
                  '&:hover': {
                    transform: 'scale(1.02) translateY(-4px)',
                  },
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
                  }}
                />
              </Box>

              {/* Format Pills */}
              <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'center' }}>
                {['Paperback', 'Hardcover', "Collector's Edition"].map((fmt) => (
                  <Button
                    key={fmt}
                    size="small"
                    onClick={() => setSelectedFormat(fmt)}
                    sx={{
                      px: 2,
                      py: 0.6,
                      borderRadius: 9999,
                      fontSize: '0.75rem',
                      fontWeight: selectedFormat === fmt ? 700 : 500,
                      bgcolor: selectedFormat === fmt ? 'primary.main' : '#ffffff',
                      color: selectedFormat === fmt ? '#ffffff' : 'text.primary',
                      border: '1px solid',
                      borderColor: selectedFormat === fmt ? 'primary.main' : '#d9e2ec',
                      boxShadow: selectedFormat === fmt ? '0 2px 6px rgba(26,54,93,0.15)' : 'none',
                      '&:hover': {
                        bgcolor: selectedFormat === fmt ? 'primary.light' : '#eaeff5',
                      },
                    }}
                  >
                    {fmt}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Right Column: Book Details & Actions */}
          <Grid item xs={12} lg={7}>
            <Box>
              {/* Badges Row */}
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 9999,
                    bgcolor: 'secondaryContainer.main',
                    color: 'secondaryContainer.contrastText',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {book.genre}
                </Box>
                {book.isBestseller && (
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.4,
                      borderRadius: 9999,
                      bgcolor: 'tertiary.main',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    Bestseller
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: '#065f46',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 16 }}>
                    check_circle
                  </Box>
                  <span>In Stock ({book.stockCount} copies available)</span>
                </Box>
              </Stack>

              {/* Title & Subtitle */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {book.title}
              </Typography>

              {book.subtitle && (
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, mb: 2 }}>
                  {book.subtitle}
                </Typography>
              )}

              {/* Author & Publisher Lockup */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 3 }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{ mb: 3 }}
              >
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  By{' '}
                  <Box component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                    {book.author}
                  </Box>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Publisher: {book.publisher}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18, color: 'tertiary.main' }}>
                    star
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {book.rating}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    ({book.reviewCount} customer reviews)
                  </Typography>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2.5, borderColor: '#eaeff5' }} />

              {/* Price Block */}
              <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ${book.price.toFixed(2)}
                </Typography>
                {book.originalPrice && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ color: '#727782', textDecoration: 'line-through', fontWeight: 400 }}
                    >
                      ${book.originalPrice.toFixed(2)}
                    </Typography>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.3,
                        borderRadius: 9999,
                        bgcolor: 'tertiaryContainer.main',
                        color: 'tertiaryContainer.contrastText',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      Save {Math.round((1 - book.price / book.originalPrice) * 100)}%
                    </Box>
                  </>
                )}
              </Stack>

              {/* Quantity Selector & CTAs */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems="center"
                sx={{ mb: 4 }}
              >
                {/* Quantity Pill */}
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    bgcolor: '#f1f5f9',
                    borderRadius: 9999,
                    border: '1px solid #d9e2ec',
                    p: '4px',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={handleDecrement}
                    sx={{ width: 32, height: 32, fontWeight: 'bold' }}
                  >
                    -
                  </IconButton>
                  <Typography
                    variant="body1"
                    sx={{ width: 36, textAlign: 'center', fontWeight: 700 }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleIncrement}
                    sx={{ width: 32, height: 32, fontWeight: 'bold' }}
                  >
                    +
                  </IconButton>
                </Stack>

                {/* Add to Bag CTA */}
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  sx={{
                    flex: 1,
                    height: 48,
                    borderRadius: 9999,
                    bgcolor: 'primary.main',
                    fontSize: '1rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(26,54,93,0.25)',
                    '&:hover': { bgcolor: 'primary.light' },
                  }}
                  startIcon={
                    <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                      shopping_bag
                    </Box>
                  }
                >
                  Add to Bag
                </Button>

                {/* Buy Now CTA */}
                <Button
                  variant="contained"
                  onClick={handleBuyNow}
                  sx={{
                    height: 48,
                    px: 3.5,
                    borderRadius: 9999,
                    bgcolor: 'secondaryContainer.main',
                    color: 'secondaryContainer.contrastText',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#c2d4f8', boxShadow: 'none' },
                  }}
                  startIcon={
                    <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18 }}>
                      bolt
                    </Box>
                  }
                >
                  Buy Now
                </Button>
              </Stack>

              {/* Key Features Cards */}
              {book.keyFeatures && (
                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {book.keyFeatures.map((feat, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        component="span"
                        className="material-symbols-outlined"
                        sx={{ fontSize: 20, color: 'primary.main', mt: '2px' }}
                      >
                        verified
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5 }}>
                        {feat}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}

              {/* Description */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  Synopsis & Overview
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {book.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Technical Metadata & Specifications Table */}
        {book.specs && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 2.5 }}>
              Technical Metadata & Edition Specifications
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: '20px',
                border: '1px solid #d9e2ec',
                boxShadow: 'none',
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableBody>
                  <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                    <TableCell sx={{ fontWeight: 700, width: '30%', color: 'primary.main' }}>ISBN-13</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{book.specs.isbn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Binding Format</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{book.specs.format}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Page Count</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{book.specs.pages} pages</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Language</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{book.specs.language}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Publisher</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{book.specs.publisher}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Physical Dimensions</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{book.specs.dimensions}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Shipping Weight</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{book.specs.weight}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Highlighted Reviews */}
        {book.reviews && book.reviews.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 2.5 }}>
              Highlighted Reader Reviews
            </Typography>
            <Grid container spacing={3}>
              {book.reviews.map((rev) => (
                <Grid item xs={12} md={6} key={rev.id}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      bgcolor: '#ffffff',
                      border: '1px solid #eaeff5',
                      boxShadow: '0 1px 3px rgba(26,54,93,0.04)',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'secondaryContainer.main', color: 'primary.main', fontWeight: 700 }}>
                        {rev.author.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {rev.author}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {rev.role || 'Verified Purchaser'} • {rev.date}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.2}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Box
                            key={i}
                            component="span"
                            className="material-symbols-outlined"
                            sx={{ fontSize: 16, color: 'tertiary.main' }}
                          >
                            star
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      "{rev.comment}"
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Readers Also Purchased */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 3 }}>
            Readers Also Purchased
          </Typography>
          <Grid container spacing={3}>
            {relatedBooks.map((b) => (
              <Grid item xs={12} sm={6} md={3} key={b.id}>
                <BookCard book={b} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};


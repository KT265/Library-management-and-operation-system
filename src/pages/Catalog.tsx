import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  InputBase,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Switch,
  Divider,
} from '@mui/material';
import { MOCK_BOOKS } from '../data/mockData';
import { BookCard } from '../components/BookCard';
import { BookGenre, BookFormat } from '../types';
import { useStore } from '../store/useStore';

const GENRE_OPTIONS: BookGenre[] = [
  'Distributed Systems',
  'Computer Science',
  'Tech & Coding',
  'Literary Fiction',
  'Sci-Fi & Fantasy',
  'Self-Growth',
  'History & Mind',
];

const FORMAT_OPTIONS: BookFormat[] = ['Hardcover', 'Paperback', "Collector's Cloth"];

export const Catalog: React.FC = () => {
  const { searchQuery, setSearchQuery } = useStore();
  const [filterQuery, setFilterQuery] = useState(searchQuery);
  const [selectedGenres, setSelectedGenres] = useState<BookGenre[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<BookFormat[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const handleToggleGenre = (genre: BookGenre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleToggleFormat = (format: BookFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const handleResetFilters = () => {
    setSelectedGenres([]);
    setSelectedFormats([]);
    setInStockOnly(false);
    setFilterQuery('');
    setSearchQuery('');
  };

  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS.filter((book) => {
      // Query filter
      const activeSearch = filterQuery || searchQuery;
      if (activeSearch.trim()) {
        const q = activeSearch.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(q);
        const matchesAuthor = book.author.toLowerCase().includes(q);
        const matchesGenre = book.genre.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesGenre) return false;
      }

      // Genre filter
      if (selectedGenres.length > 0 && !selectedGenres.includes(book.genre)) {
        return false;
      }

      // Format filter
      if (selectedFormats.length > 0 && !selectedFormats.includes(book.format)) {
        return false;
      }

      // In stock filter
      if (inStockOnly && !book.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filterQuery, searchQuery, selectedGenres, selectedFormats, inStockOnly, sortBy]);

  return (
    <Box sx={{ width: '100%', pb: 8 }}>
      {/* Editorial Header Strip */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, pt: 3, pb: 3 }}>
        <Box
          sx={{
            maxWidth: 1440,
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.02em', mb: 0.5 }}
            >
              The Library Catalog
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Curated physical editions, critical literature, and technical blueprints.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main 2-Column Section */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
          <Grid container spacing={4} alignItems="flex-start">
            {/* Left Filter Rail / Sidebar */}
            <Grid item xs={12} lg={3}>
              <Box
                sx={{
                  bgcolor: '#f1f5f9',
                  borderRadius: '24px',
                  p: 3,
                  boxShadow: '0 1px 3px rgba(26,54,93,0.04)',
                }}
              >
                {/* Header & Reset */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20, color: 'primary.main' }}>
                      filter_list
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      Filter Selections
                    </Typography>
                  </Stack>
                  <Button
                    size="small"
                    onClick={handleResetFilters}
                    sx={{
                      fontSize: '0.8rem',
                      color: 'text.secondary',
                      p: 0,
                      minWidth: 'auto',
                      fontWeight: 600,
                      '&:hover': { color: 'tertiary.main', bgcolor: 'transparent' },
                    }}
                  >
                    Reset
                  </Button>
                </Stack>

                {/* Filter Rail Search */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#ffffff',
                    borderRadius: 9999,
                    px: 2,
                    py: 0.6,
                    mb: 3,
                    border: '1px solid #d9e2ec',
                  }}
                >
                  <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18, color: '#727782', mr: 1 }}>
                    search
                  </Box>
                  <InputBase
                    placeholder="Filter current list..."
                    value={filterQuery}
                    onChange={(e) => {
                      setFilterQuery(e.target.value);
                      setSearchQuery(e.target.value);
                    }}
                    sx={{ flex: 1, fontSize: '0.85rem' }}
                  />
                  {filterQuery && (
                    <Box
                      component="button"
                      onClick={() => {
                        setFilterQuery('');
                        setSearchQuery('');
                      }}
                      sx={{
                        border: 'none',
                        bgcolor: 'transparent',
                        cursor: 'pointer',
                        color: 'text.secondary',
                        p: 0,
                        display: 'flex',
                      }}
                    >
                      <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 16 }}>
                        close
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Genres */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#727782', letterSpacing: '0.06em', display: 'block', mb: 1.5 }}>
                    Curated Categories
                  </Typography>
                  <Stack spacing={0.5}>
                    {GENRE_OPTIONS.map((genre) => (
                      <FormControlLabel
                        key={genre}
                        control={
                          <Checkbox
                            checked={selectedGenres.includes(genre)}
                            onChange={() => handleToggleGenre(genre)}
                            size="small"
                            sx={{ p: 0.5, color: '#727782', '&.Mui-checked': { color: 'primary.main' } }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: selectedGenres.includes(genre) ? 600 : 400 }}>
                            {genre}
                          </Typography>
                        }
                        sx={{ ml: 0, mr: 0 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 2.5, borderColor: '#d9e2ec' }} />

                {/* Format / Binding */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#727782', letterSpacing: '0.06em', display: 'block', mb: 1.5 }}>
                    Binding & Format
                  </Typography>
                  <Stack spacing={0.5}>
                    {FORMAT_OPTIONS.map((format) => (
                      <FormControlLabel
                        key={format}
                        control={
                          <Checkbox
                            checked={selectedFormats.includes(format)}
                            onChange={() => handleToggleFormat(format)}
                            size="small"
                            sx={{ p: 0.5, color: '#727782', '&.Mui-checked': { color: 'primary.main' } }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: selectedFormats.includes(format) ? 600 : 400 }}>
                            {format}
                          </Typography>
                        }
                        sx={{ ml: 0, mr: 0 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 2.5, borderColor: '#d9e2ec' }} />

                {/* Availability Toggle */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
                    In Stock Only
                  </Typography>
                  <Switch
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'primary.main',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'primary.main',
                      },
                    }}
                  />
                </Stack>
              </Box>
            </Grid>

            {/* Right Catalog Grid */}
            <Grid item xs={12} lg={9}>
              {/* Sort & Stats Bar */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{
                  bgcolor: '#f1f5f9',
                  p: 2,
                  px: 3,
                  borderRadius: '20px',
                  mb: 3,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Showing{' '}
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    {filteredBooks.length}
                  </Box>{' '}
                  volumes
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Sort by:
                  </Typography>
                  <FormControl size="small">
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      sx={{
                        borderRadius: 9999,
                        bgcolor: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        height: 36,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d9e2ec',
                        },
                      }}
                    >
                      <MenuItem value="featured">Featured Picks</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Top Rated</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>

              {/* Active Filter Pills */}
              {(selectedGenres.length > 0 || selectedFormats.length > 0 || inStockOnly || filterQuery) && (
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 3 }}>
                  {filterQuery && (
                    <Chip
                      label={`Query: "${filterQuery}"`}
                      size="small"
                      onDelete={() => {
                        setFilterQuery('');
                        setSearchQuery('');
                      }}
                      sx={{ bgcolor: 'secondaryContainer.main', fontWeight: 600 }}
                    />
                  )}
                  {selectedGenres.map((g) => (
                    <Chip
                      key={g}
                      label={g}
                      size="small"
                      onDelete={() => handleToggleGenre(g)}
                      sx={{ bgcolor: 'secondaryContainer.main', fontWeight: 600 }}
                    />
                  ))}
                  {selectedFormats.map((f) => (
                    <Chip
                      key={f}
                      label={f}
                      size="small"
                      onDelete={() => handleToggleFormat(f)}
                      sx={{ bgcolor: 'secondaryContainer.main', fontWeight: 600 }}
                    />
                  ))}
                  {inStockOnly && (
                    <Chip
                      label="In Stock"
                      size="small"
                      onDelete={() => setInStockOnly(false)}
                      sx={{ bgcolor: 'secondaryContainer.main', fontWeight: 600 }}
                    />
                  )}
                </Stack>
              )}

              {/* Grid of Books */}
              {filteredBooks.length === 0 ? (
                <Box
                  sx={{
                    py: 12,
                    textAlign: 'center',
                    bgcolor: '#ffffff',
                    borderRadius: '24px',
                    border: '1px solid #eaeff5',
                  }}
                >
                  <Box
                    component="span"
                    className="material-symbols-outlined"
                    sx={{ fontSize: 48, color: '#c2c7d0', mb: 1, display: 'block' }}
                  >
                    search_off
                  </Box>
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    No books matched your criteria
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Try relaxing your filters or search keywords.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleResetFilters}
                    sx={{ borderRadius: 9999 }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredBooks.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.id}>
                      <BookCard book={book} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};


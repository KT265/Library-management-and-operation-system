import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  InputBase,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MOCK_BOOKS, MOCK_GENRES } from '../data/mockData';
import { BookCard } from '../components/BookCard';
import { useStore } from '../store/useStore';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchQuery } = useStore();
  const [heroSearch, setHeroSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tech' | 'fiction'>('all');

  const handleHeroSearch = () => {
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch);
      navigate('/catalog');
    }
  };

  const filteredBooks = MOCK_BOOKS.filter((book) => {
    if (activeTab === 'tech') {
      return book.genre === 'Tech & Coding' || book.genre === 'Distributed Systems' || book.genre === 'Computer Science';
    }
    if (activeTab === 'fiction') {
      return book.genre === 'Literary Fiction' || book.genre === 'Sci-Fi & Fantasy';
    }
    return true;
  });

  return (
    <Box sx={{ width: '100%', pb: 8 }}>
      {/* Hero Showcase Section */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, pt: 3, pb: 4 }}>
        <Box
          sx={{
            maxWidth: 1440,
            mx: 'auto',
            position: 'relative',
            borderRadius: '28px',
            bgcolor: '#e2e8f0',
            overflow: 'hidden',
            p: { xs: 3, sm: 4, md: 6, lg: 8 },
            boxShadow: '0 1px 4px rgba(26, 54, 93, 0.04)',
          }}
        >
          {/* Ambient Lighting Spheres */}
          <Box
            sx={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 380,
              height: 380,
              borderRadius: '50%',
              bgcolor: 'rgba(218, 226, 249, 0.5)',
              filter: 'blur(70px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -60,
              right: '25%',
              width: 320,
              height: 320,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 219, 207, 0.45)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Left Hero Copy */}
            <Grid item xs={12} lg={7}>
              <Box sx={{ maxWidth: 640 }}>
                {/* Event Ribbon Badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.6,
                    borderRadius: 9999,
                    bgcolor: 'tertiary.main',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    mb: 2.5,
                    boxShadow: '0 2px 8px rgba(200, 90, 50, 0.3)',
                  }}
                >
                  <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 16 }}>
                    local_fire_department
                  </Box>
                  <span>AUTUMN LITERARY GALA • LIMITED TIME</span>
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: 'primary.main',
                    fontSize: { xs: '2rem', sm: '2.8rem', md: '3.4rem' },
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    mb: 2,
                  }}
                >
                  Autumn Literary Gala:{' '}
                  <Box
                    component="span"
                    sx={{
                      color: 'tertiary.main',
                      display: { xs: 'inline', sm: 'block' },
                    }}
                  >
                    Up to 40% Off
                  </Box>{' '}
                  Bestsellers
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.6,
                    mb: 3.5,
                  }}
                >
                  Immerse yourself in award-winning fiction, definitive software engineering treatises, and profound memoirs. Hand-picked physical editions with next-day complimentary dispatch.
                </Typography>

                {/* Hero Search Box */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#ffffff',
                    borderRadius: 9999,
                    p: 0.8,
                    pl: 2.5,
                    boxShadow: '0 4px 16px rgba(26, 54, 93, 0.08)',
                    mb: 2.5,
                    border: '1px solid #d9e2ec',
                  }}
                >
                  <Box
                    component="span"
                    className="material-symbols-outlined"
                    sx={{ fontSize: 22, color: 'text.secondary', mr: 1.5 }}
                  >
                    search
                  </Box>
                  <InputBase
                    placeholder="Search by title, author, or ISBN-13..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
                    sx={{ flex: 1, fontSize: '0.95rem' }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleHeroSearch}
                    sx={{
                      borderRadius: 9999,
                      px: 3.5,
                      py: 1.2,
                      bgcolor: 'primary.main',
                      fontWeight: 700,
                      '&:hover': { bgcolor: 'primary.light' },
                    }}
                  >
                    Search
                  </Button>
                </Box>

                {/* Trending Tags */}
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                    Trending:
                  </Typography>
                  {['Fiction', 'Sci-Fi', 'Tech & Code', 'Biography', 'Fine Art'].map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => {
                        setSearchQuery(tag);
                        navigate('/catalog');
                      }}
                      sx={{
                        bgcolor: '#ffffff',
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        '&:hover': { bgcolor: 'secondaryContainer.main' },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* Right Hero Visual Book Duo */}
            <Grid item xs={12} lg={5}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 340, sm: 400 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Book 1 (Left tilted) */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: { xs: 180, sm: 220 },
                    height: { xs: 260, sm: 310 },
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 15px 35px rgba(26, 54, 93, 0.2)',
                    transform: 'rotate(-12deg) translateX(-45px) translateY(15px)',
                    transition: 'transform 0.4s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'rotate(-6deg) translateX(-35px) translateY(5px)',
                    },
                  }}
                  onClick={() => navigate('/book/book-2')}
                >
                  <Box
                    component="img"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZY_mCmXd7d5r_9SF1xi1uh_K0jg84AePGHukXA-pDFfJ8zp3esiwY481hBlZgEqYYlxlDfVGqIcwbI6-N2yAwRfcxZ_7W0NWX6jnTHutvSZtX4ImBzSBbzXMrQVrXaemDdDtFWSy5SO_eRAoCHxWzPhp1afQDtoog8aVnaWu1h_Fo_cujmszPGNG6gt7Ruo8OOFKGJdFZKS7fRm8OEzDOefFDDjnxC1K1GXzinb91"
                    alt="Klara and the Sun"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      background: 'linear-gradient(to top, rgba(0,32,69,0.85), transparent)',
                      color: '#ffffff',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'secondaryContainer.main', textTransform: 'uppercase' }}>
                      Nobel Laureate
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      Klara and the Sun
                    </Typography>
                  </Box>
                </Box>

                {/* Book 2 (Right prominent) */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: { xs: 195, sm: 240 },
                    height: { xs: 275, sm: 330 },
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(26, 54, 93, 0.28)',
                    transform: 'rotate(6deg) translateX(40px) translateY(-10px)',
                    transition: 'transform 0.4s ease',
                    zIndex: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'rotate(2deg) translateX(30px) translateY(-5px)',
                    },
                  }}
                  onClick={() => navigate('/book/book-1')}
                >
                  <Box
                    component="img"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9OWzkbWHX0EEUxgjNw0-2pIGCHILqrqmjBTJpxT_pyjGFvnllY24sDe9tQCJvNQD6vLQXC16_gBcEU3ynsskC4w-VEyVUlhKrDom1QmGFGEqe3X5mgqabmAxnfOdm60EaEFcKDFSA3b9RdlK5vmXjCREFKGA9DR7Ll331-lA0nGpQJyCZ_hhi0ZOH6M1INPnyXMId3l-GBDlR0bSftswGP4D9vO3mc9svVJ-tLVKW"
                    alt="Designing Data-Intensive Applications"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      background: 'linear-gradient(to top, rgba(0,32,69,0.9), transparent)',
                      color: '#ffffff',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'tertiaryContainer.main', textTransform: 'uppercase' }}>
                      Essential Tech
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      Designing Data-Intensive Applications
                    </Typography>
                  </Box>
                </Box>

                {/* Floating Discount Tag */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 16,
                    zIndex: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    px: 2,
                    py: 1,
                    borderRadius: '16px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: 'tertiary.main',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                      percent
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>
                      Instant Discount
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'tertiary.main' }}>
                      Save 40%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Curated Genres Grid Section */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 4 }}>
        <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.01em' }}>
                Explore by Curated Genres
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Browse across catalog collections selected by literary curators
              </Typography>
            </Box>
            <Button
              onClick={() => navigate('/catalog')}
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' },
              }}
              endIcon={
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 18 }}>
                  chevron_right
                </Box>
              }
            >
              All Genres
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {MOCK_GENRES.map((genre) => (
              <Grid item xs={6} sm={4} lg={2} key={genre.name}>
                <Box
                  onClick={() => {
                    setSearchQuery(genre.name);
                    navigate('/catalog');
                  }}
                  sx={{
                    p: 2.5,
                    borderRadius: '20px',
                    bgcolor: '#f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 1px 3px rgba(26,54,93,0.03)',
                    '&:hover': {
                      bgcolor: 'secondaryContainer.main',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 16px rgba(26,54,93,0.08)',
                      '& .genre-icon': {
                        bgcolor: 'primary.main',
                        color: '#ffffff',
                      },
                    },
                  }}
                >
                  <Box
                    className="genre-icon"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#ffffff',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 24 }}>
                      {genre.icon}
                    </Box>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2, mb: 0.5 }}>
                    {genre.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {genre.count}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Featured Catalog Highlights */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 4 }}>
        <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={2}
            sx={{ mb: 4 }}
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'tertiary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'tertiary.main', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Featured Catalog Highlights
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.02em' }}>
                Hand-Selected Volumes
              </Typography>
            </Box>

            {/* Filter Tabs */}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                bgcolor: '#f1f5f9',
                p: '4px',
                borderRadius: 9999,
              }}
            >
              <Button
                size="small"
                onClick={() => setActiveTab('all')}
                sx={{
                  px: 2,
                  py: 0.6,
                  borderRadius: 9999,
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'all' ? 700 : 500,
                  bgcolor: activeTab === 'all' ? '#ffffff' : 'transparent',
                  color: activeTab === 'all' ? 'primary.main' : 'text.secondary',
                  boxShadow: activeTab === 'all' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  '&:hover': { bgcolor: activeTab === 'all' ? '#ffffff' : '#e2e8f0' },
                }}
              >
                All Picks
              </Button>
              <Button
                size="small"
                onClick={() => setActiveTab('tech')}
                sx={{
                  px: 2,
                  py: 0.6,
                  borderRadius: 9999,
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'tech' ? 700 : 500,
                  bgcolor: activeTab === 'tech' ? '#ffffff' : 'transparent',
                  color: activeTab === 'tech' ? 'primary.main' : 'text.secondary',
                  boxShadow: activeTab === 'tech' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  '&:hover': { bgcolor: activeTab === 'tech' ? '#ffffff' : '#e2e8f0' },
                }}
              >
                Engineering
              </Button>
              <Button
                size="small"
                onClick={() => setActiveTab('fiction')}
                sx={{
                  px: 2,
                  py: 0.6,
                  borderRadius: 9999,
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'fiction' ? 700 : 500,
                  bgcolor: activeTab === 'fiction' ? '#ffffff' : 'transparent',
                  color: activeTab === 'fiction' ? 'primary.main' : 'text.secondary',
                  boxShadow: activeTab === 'fiction' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  '&:hover': { bgcolor: activeTab === 'fiction' ? '#ffffff' : '#e2e8f0' },
                }}
              >
                Literature
              </Button>
            </Stack>
          </Stack>

          {/* Book Grid */}
          <Grid container spacing={3}>
            {filteredBooks.slice(0, 8).map((book) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <BookCard book={book} />
              </Grid>
            ))}
          </Grid>

          {/* Explore More CTA */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/catalog')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 9999,
                fontWeight: 700,
                fontSize: '0.95rem',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'secondaryContainer.main',
                  borderColor: 'primary.main',
                },
              }}
              endIcon={
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                  arrow_forward
                </Box>
              }
            >
              Explore Complete Catalog ({MOCK_BOOKS.length} Titles)
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MOCK_BOOKS } from '../data/mockData';
import { HeroBanner } from '../components/home/HeroBanner';
import { CuratedGenresSection } from '../components/home/CuratedGenresSection';
import { FeaturedPicksSection } from '../components/home/FeaturedPicksSection';
import { FeaturedBookItem } from '../components/home/FeaturedBookCard';
import { PatronReviewsSection } from '../components/home/PatronReviewsSection';
import { NewsletterCtaSection } from '../components/home/NewsletterCtaSection';

const FEATURED_BOOKS: FeaturedBookItem[] = [
  {
    id: 'book-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    publisher: "O'Reilly Media",
    price: 360000,
    originalPrice: 450000,
    rating: 4.9,
    reviewCount: 384,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9OWzkbWHX0EEUxgjNw0-2pIGCHILqrqmjBTJpxT_pyjGFvnllY24sDe9tQCJvNQD6vLQXC16_gBcEU3ynsskC4w-VEyVUlhKrDom1QmGFGEqe3X5mgqabmAxnfOdm60EaEFcKDFSA3b9RdlK5vmXjCREFKGA9DR7Ll331-lA0nGpQJyCZ_hhi0ZOH6M1INPnyXMId3l-GBDlR0bSftswGP4D9vO3mc9svVJ-tLVKW',
    dataAlt:
      'Cover of Designing Data-Intensive Applications by Martin Kleppmann with navy blue geometric design and wildlife etchings',
    category: 'tech',
    inStock: true,
    bookRef: MOCK_BOOKS[0],
  },
  {
    id: 'book-2',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    publisher: 'Faber & Faber',
    price: 185000,
    originalPrice: 240000,
    rating: 4.8,
    reviewCount: 612,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZY_mCmXd7d5r_9SF1xi1uh_K0jg84AePGHukXA-pDFfJ8zp3esiwY481hBlZgEqYYlxlDfVGqIcwbI6-N2yAwRfcxZ_7W0NWX6jnTHutvSZtX4ImBzSBbzXMrQVrXaemDdDtFWSy5SO_eRAoCHxWzPhp1afQDtoog8aVnaWu1h_Fo_cujmszPGNG6gt7Ruo8OOFKGJdFZKS7fRm8OEzDOefFDDjnxC1K1GXzinb91',
    dataAlt:
      'Cover of Klara and the Sun by Kazuo Ishiguro with minimalist warm pastel background and solar orb abstraction',
    category: 'fiction',
    inStock: true,
    bookRef: MOCK_BOOKS[1],
  },
  {
    id: 'book-3',
    title: 'Atomic Habits',
    author: 'James Clear',
    publisher: 'Penguin Random House',
    price: 169000,
    originalPrice: 220000,
    rating: 4.9,
    reviewCount: 1240,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2BWm70dWoUsBGPZh-GfVQvNBbXF8KFo6zjoUgPVUKYZLXRijxNTN5yeaIeojZbMELfaMa-tNRjuaWHMWbWHYAPm4dck_l5maC7t-3Zgfr77PBaST7gK4E14qptSYRgfFU2qKvvki6-waOqNAvZDXkFEFywNMx63cdN8GSdVJGHMc2ZjHbbVXQvpc-8vEhfE3ixFKLUNEJ521vIVqSUiTteNI4iStessbP7vo0a09j',
    dataAlt:
      'Cover of Atomic Habits by James Clear with clean editorial ivory cover and tiny scattered particle typography',
    category: 'growth',
    inStock: true,
    bookRef: MOCK_BOOKS[2],
  },
  {
    id: 'book-4',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    publisher: 'Addison-Wesley',
    price: 320000,
    originalPrice: 420000,
    rating: 4.9,
    reviewCount: 520,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDj7s1OBzce6kCz5wGtwYZ3a-ORJm9FKX_6dx6Y2pBev81GoIosBU4XTedUHGUaFjwDSNBGSf1G_clkjkTX5VNQqARdGSuFLAOhZXCe9lhZRRqZbKyUGr8WcbTDdzOmoEjtw648PqKFW6vxHPH1WiVGyjaIwsfO62Y519w4jZ7lFGNsjd2DGrmVYwhnQTjypDmrfCY17QzajWu26Y8COz5dMkf2od5EecgJlSpaTGbR',
    dataAlt:
      'Cover of The Pragmatic Programmer 20th Anniversary Edition with silver metallic tones and clean modern typesetting',
    category: 'tech',
    inStock: true,
    bookRef: MOCK_BOOKS[3],
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchQuery, setActiveGenre, addToCart } = useStore();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate('/catalog');
  };

  const handleGenreSelect = (genreName: string) => {
    setActiveGenre(genreName);
    setSearchQuery(genreName);
    navigate('/catalog');
  };

  const handleAddToCart = (bookItem: FeaturedBookItem) => {
    addToCart(bookItem.bookRef, 1);
  };

  const handleBuyNow = (bookItem: FeaturedBookItem) => {
    addToCart(bookItem.bookRef, 1);
    navigate('/checkout');
  };

  return (
    <div
      id="home-page-root"
      data-testid="home-page-coordinator"
      className="flex flex-col w-full bg-surface text-primary font-body-md"
    >
      {/* 1. Hero Editorial Banner */}
      <HeroBanner onSearch={handleSearch} onGenreSelect={handleGenreSelect} />

      {/* 2. Explore by Curated Genres */}
      <CuratedGenresSection onSelectGenre={handleGenreSelect} />

      {/* 3. Hand-Selected Volumes (Featured Catalog Picks) */}
      <FeaturedPicksSection
        books={FEATURED_BOOKS}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* 4. Patron Testimonials & Institutional Assurance */}
      <PatronReviewsSection />

      {/* 5. Newsletter Subscription CTA */}
      <NewsletterCtaSection />
    </div>
  );
};

export default Home;

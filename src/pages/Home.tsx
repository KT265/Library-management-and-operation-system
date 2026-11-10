import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchBooksFromFirestore } from '../services/firebase';
import { HeroBanner } from '../components/home/HeroBanner';
import { CuratedGenresSection } from '../components/home/CuratedGenresSection';
import { FeaturedPicksSection } from '../components/home/FeaturedPicksSection';
import { FeaturedBookItem } from '../components/home/FeaturedBookCard';
import { PatronReviewsSection } from '../components/home/PatronReviewsSection';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchQuery, setActiveGenre, addToCart } = useStore();

  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBookItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeaturedBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const books = await fetchBooksFromFirestore();
      const mapped: FeaturedBookItem[] = books.map((b) => {
        const catLower = (b.genre || '').toLowerCase();
        const category: 'tech' | 'fiction' | 'growth' =
          catLower.includes('công nghệ') || catLower.includes('tech') || catLower.includes('distributed')
            ? 'tech'
            : catLower.includes('kỹ năng') || catLower.includes('thói quen') || catLower.includes('growth')
            ? 'growth'
            : 'fiction';

        return {
          id: b.id,
          title: b.title,
          author: b.author,
          publisher: b.publisher || 'NXB Trẻ',
          price: b.price,
          originalPrice: b.originalPrice || Math.round(b.price * 1.25),
          rating: b.rating || 5.0,
          reviewCount: b.reviewCount || 0,
          coverImage: b.coverImage,
          dataAlt: `Bìa sách ${b.title} của tác giả ${b.author}`,
          category,
          inStock: b.inStock,
          bookRef: b,
        };
      });
      setFeaturedBooks(mapped);
    } catch (err: any) {
      console.error('[Home] Failed to load featured books from Firestore:', err);
      setError(err?.message || 'Không thể tải danh sách ấn phẩm tiêu biểu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedBooks();
  }, []);

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
      {isLoading ? (
        <div
          id="home-featured-loading"
          data-testid="home-featured-loading-spinner"
          className="w-full px-gutter-lg py-space-xl flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-secondary font-medium">Đang tải ấn phẩm tiêu biểu...</p>
        </div>
      ) : error ? (
        <div
          id="home-featured-error"
          data-testid="home-featured-error-state"
          className="w-full max-w-xl mx-auto my-space-lg p-space-lg bg-error/5 border border-error/20 rounded-2xl text-center"
        >
          <p className="text-error font-medium mb-3">{error}</p>
          <button
            onClick={loadFeaturedBooks}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container cursor-pointer transition-colors"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <FeaturedPicksSection
          books={featuredBooks}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* 4. Patron Testimonials & Institutional Assurance */}
      <PatronReviewsSection />
    </div>
  );
};

export default Home;

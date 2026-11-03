import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Book } from '../types';

interface FeaturedBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  dataAlt: string;
  category: 'tech' | 'fiction' | 'growth';
  inStock: boolean;
  bookRef: Book;
}

// 4 Canonical Hand-Selected Volumes directly extracted from Stitch screen b8aa266d
const FEATURED_BOOKS: FeaturedBook[] = [
  {
    id: 'book-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    publisher: "O'Reilly Media",
    price: 38.99,
    originalPrice: 51.99,
    rating: 4.9,
    reviewCount: 384,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9OWzkbWHX0EEUxgjNw0-2pIGCHILqrqmjBTJpxT_pyjGFvnllY24sDe9tQCJvNQD6vLQXC16_gBcEU3ynsskC4w-VEyVUlhKrDom1QmGFGEqe3X5mgqabmAxnfOdm60EaEFcKDFSA3b9RdlK5vmXjCREFKGA9DR7Ll331-lA0nGpQJyCZ_hhi0ZOH6M1INPnyXMId3l-GBDlR0bSftswGP4D9vO3mc9svVJ-tLVKW',
    dataAlt:
      'Cover of Designing Data-Intensive Applications by Martin Kleppmann with navy blue geometric design and wildlife etchings',
    category: 'tech',
    inStock: true,
    bookRef: {
      id: 'book-1',
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      publisher: "O'Reilly Media",
      price: 38.99,
      originalPrice: 51.99,
      rating: 4.9,
      reviewCount: 384,
      inStock: true,
      stockCount: 42,
      coverImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA9OWzkbWHX0EEUxgjNw0-2pIGCHILqrqmjBTJpxT_pyjGFvnllY24sDe9tQCJvNQD6vLQXC16_gBcEU3ynsskC4w-VEyVUlhKrDom1QmGFGEqe3X5mgqabmAxnfOdm60EaEFcKDFSA3b9RdlK5vmXjCREFKGA9DR7Ll331-lA0nGpQJyCZ_hhi0ZOH6M1INPnyXMId3l-GBDlR0bSftswGP4D9vO3mc9svVJ-tLVKW',
      genre: 'Distributed Systems',
      format: 'Paperback',
      description:
        'Data is at the center of many challenges in system design today. In this comprehensive guide, author Martin Kleppmann helps you navigate this diverse landscape.',
      featured: true,
      isBestseller: true,
    },
  },
  {
    id: 'book-2',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    publisher: 'Faber & Faber',
    price: 16.80,
    originalPrice: 28.00,
    rating: 4.8,
    reviewCount: 612,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZY_mCmXd7d5r_9SF1xi1uh_K0jg84AePGHukXA-pDFfJ8zp3esiwY481hBlZgEqYYlxlDfVGqIcwbI6-N2yAwRfcxZ_7W0NWX6jnTHutvSZtX4ImBzSBbzXMrQVrXaemDdDtFWSy5SO_eRAoCHxWzPhp1afQDtoog8aVnaWu1h_Fo_cujmszPGNG6gt7Ruo8OOFKGJdFZKS7fRm8OEzDOefFDDjnxC1K1GXzinb91',
    dataAlt:
      'Cover of Klara and the Sun by Kazuo Ishiguro with minimalist warm pastel background and solar orb abstraction',
    category: 'fiction',
    inStock: true,
    bookRef: {
      id: 'book-2',
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      publisher: 'Faber & Faber',
      price: 16.80,
      originalPrice: 28.00,
      rating: 4.8,
      reviewCount: 612,
      inStock: true,
      stockCount: 18,
      coverImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDZY_mCmXd7d5r_9SF1xi1uh_K0jg84AePGHukXA-pDFfJ8zp3esiwY481hBlZgEqYYlxlDfVGqIcwbI6-N2yAwRfcxZ_7W0NWX6jnTHutvSZtX4ImBzSBbzXMrQVrXaemDdDtFWSy5SO_eRAoCHxWzPhp1afQDtoog8aVnaWu1h_Fo_cujmszPGNG6gt7Ruo8OOFKGJdFZKS7fRm8OEzDOefFDDjnxC1K1GXzinb91',
      genre: 'Literary Fiction',
      format: 'Hardcover',
      description:
        'Klara and the Sun tells the story of Klara, an Artificial Friend with outstanding observational qualities.',
      featured: true,
      isBestseller: true,
    },
  },
  {
    id: 'book-3',
    title: 'Atomic Habits',
    author: 'James Clear',
    publisher: 'Penguin Random House',
    price: 17.55,
    originalPrice: 27.00,
    rating: 4.9,
    reviewCount: 1240,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2BWm70dWoUsBGPZh-GfVQvNBbXF8KFo6zjoUgPVUKYZLXRijxNTN5yeaIeojZbMELfaMa-tNRjuaWHMWbWHYAPm4dck_l5maC7t-3Zgfr77PBaST7gK4E14qptSYRgfFU2qKvvki6-waOqNAvZDXkFEFywNMx63cdN8GSdVJGHMc2ZjHbbVXQvpc-8vEhfE3ixFKLUNEJ521vIVqSUiTteNI4iStessbP7vo0a09j',
    dataAlt:
      'Cover of Atomic Habits by James Clear with clean editorial ivory cover and tiny scattered particle typography',
    category: 'growth',
    inStock: true,
    bookRef: {
      id: 'book-3',
      title: 'Atomic Habits',
      author: 'James Clear',
      publisher: 'Penguin Random House',
      price: 17.55,
      originalPrice: 27.00,
      rating: 4.9,
      reviewCount: 1240,
      inStock: true,
      stockCount: 85,
      coverImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA2BWm70dWoUsBGPZh-GfVQvNBbXF8KFo6zjoUgPVUKYZLXRijxNTN5yeaIeojZbMELfaMa-tNRjuaWHMWbWHYAPm4dck_l5maC7t-3Zgfr77PBaST7gK4E14qptSYRgfFU2qKvvki6-waOqNAvZDXkFEFywNMx63cdN8GSdVJGHMc2ZjHbbVXQvpc-8vEhfE3ixFKLUNEJ521vIVqSUiTteNI4iStessbP7vo0a09j',
      genre: 'Self-Growth',
      format: 'Hardcover',
      description:
        'An easy and proven way to build good habits and break bad ones by world-leading expert James Clear.',
      featured: true,
      isBestseller: true,
    },
  },
  {
    id: 'book-4',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    publisher: 'Addison-Wesley',
    price: 34.90,
    originalPrice: 49.99,
    rating: 4.9,
    reviewCount: 520,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDj7s1OBzce6kCz5wGtwYZ3a-ORJm9FKX_6dx6Y2pBev81GoIosBU4XTedUHGUaFjwDSNBGSf1G_clkjkTX5VNQqARdGSuFLAOhZXCe9lhZRRqZbKyUGr8WcbTDdzOmoEjtw648PqKFW6vxHPH1WiVGyjaIwsfO62Y519w4jZ7lFGNsjd2DGrmVYwhnQTjypDmrfCY17QzajWu26Y8COz5dMkf2od5EecgJlSpaTGbR',
    dataAlt:
      'Cover of The Pragmatic Programmer 20th Anniversary Edition with silver metallic tones and clean modern typesetting',
    category: 'tech',
    inStock: true,
    bookRef: {
      id: 'book-4',
      title: 'The Pragmatic Programmer',
      author: 'David Thomas & Andrew Hunt',
      publisher: 'Addison-Wesley',
      price: 34.90,
      originalPrice: 49.99,
      rating: 4.9,
      reviewCount: 520,
      inStock: true,
      stockCount: 29,
      coverImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDj7s1OBzce6kCz5wGtwYZ3a-ORJm9FKX_6dx6Y2pBev81GoIosBU4XTedUHGUaFjwDSNBGSf1G_clkjkTX5VNQqARdGSuFLAOhZXCe9lhZRRqZbKyUGr8WcbTDdzOmoEjtw648PqKFW6vxHPH1WiVGyjaIwsfO62Y519w4jZ7lFGNsjd2DGrmVYwhnQTjypDmrfCY17QzajWu26Y8COz5dMkf2od5EecgJlSpaTGbR',
      genre: 'Tech & Coding',
      format: 'Hardcover',
      description:
        'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development.',
      featured: true,
      isBestseller: false,
    },
  },
];

// 6 Curated Genres from Stitch screen b8aa266d
const CURATED_GENRES = [
  { name: 'Literary Fiction', count: '1,420 Volumes', icon: 'book_4' },
  { name: 'Tech & Coding', count: '890 Volumes', icon: 'terminal' },
  { name: 'Sci-Fi & Fantasy', count: '1,110 Volumes', icon: 'rocket_launch' },
  { name: 'Self-Growth', count: '640 Volumes', icon: 'psychology' },
  { name: 'History & Mind', count: '780 Volumes', icon: 'account_balance' },
  { name: 'Graphic Novels', count: '420 Volumes', icon: 'draw' },
];

const TRENDING_TAGS = ['Fiction', 'Sci-Fi', 'Tech & Code', 'Biography', 'Fine Art'];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchQuery, setActiveGenre, addToCart } = useStore();
  const [heroSearch, setHeroSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'tech' | 'fiction'>('all');

  const handleHeroSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch.trim());
      navigate('/catalog');
    }
  };

  const handleGenreChipClick = (tag: string) => {
    setHeroSearch(tag);
  };

  const handleCuratedGenreClick = (genreName: string) => {
    setActiveGenre(genreName);
    setSearchQuery(genreName);
    navigate('/catalog');
  };

  const handleAddToCart = (bookItem: FeaturedBook) => {
    addToCart(bookItem.bookRef, 1);
  };

  const handleBuyNow = (bookItem: FeaturedBook) => {
    addToCart(bookItem.bookRef, 1);
    navigate('/checkout');
  };

  const filteredBooks = FEATURED_BOOKS.filter((b) => {
    if (activeFilter === 'tech') return b.category === 'tech';
    if (activeFilter === 'fiction') return b.category === 'fiction';
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Editorial Banner Section */}
      <div className="w-full px-gutter-lg py-space-md">
        <div className="relative overflow-hidden rounded-3xl bg-surface-container-high p-space-lg lg:p-space-xxl shadow-sm">
          {/* Ambient Lighting Spheres */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-16 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left Column: Headline, Search & Trending */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md shadow-sm mb-space-md">
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                <span>AUTUMN LITERARY GALA • LIMITED TIME</span>
              </div>

              <h1 className="font-display-md text-display-md text-primary tracking-tight mb-space-sm">
                Autumn Literary Gala: <br className="hidden sm:inline" />
                <span className="text-tertiary-container">Up to 40% Off</span> Bestsellers
              </h1>

              <p className="font-body-lg text-body-lg text-secondary max-w-xl mb-space-lg">
                Immerse yourself in award-winning fiction, definitive software engineering treatises,
                and profound memoirs. Hand-picked physical editions with next-day complimentary dispatch.
              </p>

              {/* Hero Search Box */}
              <form
                onSubmit={handleHeroSearch}
                className="w-full max-w-xl bg-surface-container-lowest p-2 rounded-full shadow-md flex items-center gap-space-xs mb-space-md"
              >
                <span className="material-symbols-outlined text-outline ml-3 text-[22px]">search</span>
                <input
                  id="heroSearchInput"
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search by title, author, or ISBN-13..."
                  className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none px-2"
                />
                <button
                  type="submit"
                  className="shrink-0 px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Trending Genre Pills */}
              <div className="flex flex-wrap items-center gap-space-xs mb-space-xl">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mr-1">
                  Trending:
                </span>
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleGenreChipClick(tag)}
                    className="genre-chip px-space-md py-1 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md shadow-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-space-md" />
            </div>

            {/* Right Column: 3D Layered Covers & Discount Callout */}
            <div className="lg:col-span-5 relative flex items-center justify-center pt-space-lg lg:pt-0">
              <div className="relative w-full max-w-md h-80 sm:h-96 flex items-center justify-center">
                {/* Book 1 (Left tilted): Klara and the Sun */}
                <div
                  onClick={() => navigate('/book/book-2')}
                  className="absolute w-52 sm:w-56 h-72 sm:h-80 rounded-2xl overflow-hidden shadow-xl transform -rotate-12 -translate-x-12 translate-y-4 transition-transform hover:-rotate-6 hover:translate-y-2 duration-300 cursor-pointer group"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyuuv-f3hWDjo3tTeMopy0Y-N2MCzN-NhaiL9yf1Wc5r0zxpvQ4z5LmocPXSxOO9FtaDiYAY7SMs9FScflsyKKrV35-sIyfYzCPiBDEkUaCBH30-o_GCoAt0l4JmhLA9QFWqjcKAIai9V17O7YEc00FH3aXbnh3yLjLYIX4zGjJ1wWJyQHFQv2_KL-XxxFDtzGCGdnpMBTJYqa4bImqvwrtHMWgm7lanOi4dZyXRTH"
                    data-alt="Cover of Klara and the Sun with artistic minimalist sun orb on warm ochre textured linen cover art by Kazuo Ishiguro"
                    alt="Klara and the Sun"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-end p-space-md text-on-primary">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
                      Nobel Laureate
                    </span>
                    <span className="font-title-md text-title-md leading-tight">
                      Klara and the Sun
                    </span>
                  </div>
                </div>

                {/* Book 2 (Right prominent tilted): Designing Data-Intensive Applications */}
                <div
                  onClick={() => navigate('/book/book-1')}
                  className="absolute w-56 sm:w-60 h-76 sm:h-84 rounded-2xl overflow-hidden shadow-2xl transform rotate-6 translate-x-10 -translate-y-2 transition-transform hover:rotate-2 hover:translate-y-0 duration-300 z-10 cursor-pointer group"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWLrd75pKHdN7Kcyv9sftkyLxBOtVtNBfuXtH1R1uN5xNn5MiHSjQ7h9BSuRSUF6DefQ-ZmvpgIjRFX0taYM-LlYQvDlVbDdll_F3_Jel-qcW6ceJZk5Z8JEN_ft4Q4YlaEn4ojrHQUFRnR71fPmyIpAX4VnnJaWrrCKaPThWozPYIrNc-U5V0_CRcUmcbzOHFT7XHZORsMaPsztNx39_52u7OjgNknlH8veTjKJem"
                    data-alt="Cover of Designing Data-Intensive Applications showing iconic wild boar woodcut print in dark Prussian blue and cream tones"
                    alt="Designing Data-Intensive Applications"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent flex flex-col justify-end p-space-md text-on-primary">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed">
                      Essential Tech
                    </span>
                    <span className="font-title-md text-title-md leading-tight">
                      Designing Data-Intensive Applications
                    </span>
                  </div>
                </div>

                {/* Floating Instant Discount Badge */}
                <div className="absolute top-2 right-4 z-20 bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-space-sm rounded-2xl shadow-lg flex items-center gap-3 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary">
                    <span className="material-symbols-outlined text-[20px]">percent</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
                      Instant Discount
                    </span>
                    <span className="font-title-lg text-title-lg text-tertiary font-bold leading-tight">
                      Save 40%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Explore by Curated Genres Section */}
      <div className="w-full px-gutter-lg py-space-md">
        <div className="flex items-center justify-between mb-space-md">
          <div>
            <h2 className="font-title-lg text-title-lg text-primary tracking-tight">
              Explore by Curated Genres
            </h2>
            <p className="font-body-md text-body-md text-secondary">
              Browse across catalog collections selected by literary curators
            </p>
          </div>
          <Link
            to="/catalog"
            data-path="catalog"
            className="font-label-lg text-label-lg text-primary hover:underline flex items-center gap-1"
          >
            <span>All Genres</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-md">
          {CURATED_GENRES.map((genre) => (
            <div
              key={genre.name}
              data-path="catalog"
              onClick={() => handleCuratedGenreClick(genre.name)}
              className="group flex flex-col items-center text-center p-space-md rounded-2xl bg-surface-container-low hover:bg-secondary-container transition-all shadow-sm cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center mb-space-xs transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[24px]">{genre.icon}</span>
              </div>
              <span className="font-title-sm text-title-sm text-on-surface group-hover:text-on-secondary-container transition-colors">
                {genre.name}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {genre.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Hand-Selected Volumes (Featured Catalog Highlights) */}
      <div className="w-full px-gutter-lg py-space-xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-lg gap-space-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-tertiary" />
              <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest font-bold">
                Featured Catalog Highlights
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-primary tracking-tight">
              Hand-Selected Volumes
            </h2>
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-full self-start sm:self-auto">
            <button
              type="button"
              data-filter="all"
              onClick={() => setActiveFilter('all')}
              className={`tab-pill px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Picks
            </button>
            <button
              type="button"
              data-filter="tech"
              onClick={() => setActiveFilter('tech')}
              className={`tab-pill px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                activeFilter === 'tech'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Engineering
            </button>
            <button
              type="button"
              data-filter="fiction"
              onClick={() => setActiveFilter('fiction')}
              className={`tab-pill px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                activeFilter === 'fiction'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Literature
            </button>
          </div>
        </div>

        {/* 4 Books Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg" id="featuredGrid">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group flex flex-col justify-between rounded-3xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {/* 3:4 Aspect Ratio Cover Preview */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container mb-space-md shadow-inner">
                  <img
                    src={book.coverImage}
                    data-alt={book.dataAlt}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Stock Status & Star Rating Row */}
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>In Stock</span>
                  </span>
                  <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
                    <span
                      className="material-symbols-outlined text-[16px] text-tertiary-container"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>
                    <span className="font-bold">{book.rating}</span>
                    <span className="text-outline">({book.reviewCount})</span>
                  </div>
                </div>

                {/* Book Title & Author/Publisher */}
                <h3 className="font-title-md text-title-md text-primary font-bold line-clamp-1 group-hover:text-primary-container transition-colors">
                  {book.title}
                </h3>
                <p className="font-body-sm text-body-sm text-secondary mb-space-md">
                  {book.author} • {book.publisher}
                </p>
              </div>

              {/* Price & Action Button Cluster */}
              <div className="pt-space-sm mt-auto">
                <div className="flex items-baseline gap-2 mb-space-sm">
                  <span className="font-title-lg text-title-lg text-primary font-bold">
                    ${book.price.toFixed(2)}
                  </span>
                  <span className="font-body-sm text-body-sm text-outline line-through">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Action 1: Buy Now */}
                <button
                  type="button"
                  data-path="cart-checkout"
                  onClick={() => handleBuyNow(book)}
                  className="w-full mb-2 py-2 px-4 rounded-full bg-secondary-container text-on-primary-fixed hover:bg-secondary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all border-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Buy Now</span>
                </button>

                {/* Action 2: Add to Bag */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(book)}
                  className="add-cart-btn w-full h-11 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structural Spacers from Stitch Design */}
      <div className="w-full px-gutter-lg py-space-md" />
      <div className="w-full px-gutter-lg py-space-xl" />
    </div>
  );
};

export default Home;

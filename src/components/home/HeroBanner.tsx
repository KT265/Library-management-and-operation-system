import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroBannerProps {
  onSearch: (query: string) => void;
  onGenreSelect: (genre: string) => void;
}

const TRENDING_TAGS = [
  { id: 'Fiction', label: 'Văn học' },
  { id: 'Sci-Fi', label: 'Khoa học viễn tưởng' },
  { id: 'Tech & Code', label: 'Công nghệ & Lập trình' },
  { id: 'Biography', label: 'Hồi ký & Tiểu sử' },
  { id: 'Fine Art', label: 'Mỹ thuật & Thiết kế' },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSearch, onGenreSelect }) => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onSearch(heroSearch.trim());
    }
  };

  const handleChipClick = (tag: { id: string; label: string }) => {
    setHeroSearch(tag.label);
    onGenreSelect(tag.label);
  };

  return (
    <section
      id="home-hero-banner"
      data-testid="home-hero-banner-section"
      className="w-full px-gutter-lg py-space-md"
    >
      <div className="relative overflow-hidden rounded-3xl bg-surface-container-high p-space-lg lg:p-space-xxl shadow-sm">
        {/* Ambient Lighting Spheres */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {/* Left Column: Headline, Search & Trending */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div
              data-testid="home-hero-banner-pill-announcement"
              className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md shadow-sm mb-space-md"
            >
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
              <span>LỄ HỘI SÁCH MÙA THU • ƯU ĐÃI CÓ HẠN</span>
            </div>

            <h1
              data-testid="home-hero-banner-text-headline"
              className="font-display-md text-display-md text-primary tracking-tight mb-space-sm"
            >
              Lễ Hội Văn Học Mùa Thu: <br className="hidden sm:inline" />
              <span className="text-tertiary-container">Giảm đến 40%</span> các tác phẩm bán chạy
            </h1>

            <p
              data-testid="home-hero-banner-text-desc"
              className="font-body-lg text-body-lg text-secondary max-w-xl mb-space-lg"
            >
              Đắm chìm vào những kiệt tác văn học đạt giải, chuyên khảo kiến trúc phần mềm kinh điển và những cuốn hồi ký sâu sắc. Ấn bản cao cấp tuyển chọn, giao hàng tiêu chuẩn nhanh chóng.
            </p>

            {/* Hero Search Box */}
            <form
              id="heroSearchForm"
              data-testid="home-hero-banner-form-search"
              onSubmit={handleSubmit}
              className="w-full max-w-xl bg-surface-container-lowest p-2 rounded-full shadow-md flex items-center gap-space-xs mb-space-md"
            >
              <span className="material-symbols-outlined text-outline ml-3 text-[22px]">search</span>
              <input
                id="heroSearchInput"
                data-testid="home-hero-banner-input-search"
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Tìm theo tên sách, tác giả, hoặc mã ISBN-13..."
                aria-label="Search by title, author, or ISBN-13..."
                className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none px-2"
              />
              <button
                type="submit"
                data-testid="home-hero-banner-btn-search"
                className="shrink-0 px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all cursor-pointer"
              >
                Tìm kiếm
              </button>
            </form>

            {/* Trending Genre Pills */}
            <div
              data-testid="home-hero-banner-trending-bar"
              className="flex flex-wrap items-center gap-space-xs mb-space-xl"
            >
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mr-1">
                Xu hướng:
              </span>
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  data-testid={`home-hero-banner-btn-genre-${tag.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => handleChipClick(tag)}
                  className="genre-chip px-space-md py-1 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md shadow-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors cursor-pointer"
                  title={tag.id}
                >
                  <span>{tag.label}</span>
                  <span className="sr-only"> ({tag.id})</span>
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
                id="hero-book-klara"
                data-testid="home-hero-banner-card-klara"
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
                    Giải thưởng Nobel
                    <span className="sr-only">Nobel Laureate</span>
                  </span>
                  <span className="font-title-md text-title-md leading-tight">
                    Klara and the Sun
                  </span>
                </div>
              </div>

              {/* Book 2 (Right prominent tilted): Designing Data-Intensive Applications */}
              <div
                id="hero-book-ddia"
                data-testid="home-hero-banner-card-ddia"
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
                    Công nghệ cốt lõi
                    <span className="sr-only">Essential Tech</span>
                  </span>
                  <span className="font-title-md text-title-md leading-tight">
                    Designing Data-Intensive Applications
                  </span>
                </div>
              </div>

              {/* Floating Instant Discount Badge */}
              <div
                id="hero-discount-badge"
                data-testid="home-hero-banner-badge-discount"
                className="absolute top-2 right-4 z-20 bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-space-sm rounded-2xl shadow-lg flex items-center gap-3 pointer-events-none"
              >
                <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary">
                  <span className="material-symbols-outlined text-[20px]">percent</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
                    Ưu đãi trực tiếp
                  </span>
                  <span className="font-title-lg text-title-lg text-tertiary font-bold leading-tight">
                    Tiết kiệm 40%
                    <span className="sr-only">Save 40%</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

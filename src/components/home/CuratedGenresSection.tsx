import React from 'react';
import { Link } from 'react-router-dom';

interface CuratedGenre {
  name: string;
  labelVi: string;
  count: string;
  icon: string;
}

const CURATED_GENRES: CuratedGenre[] = [
  { name: 'Literary Fiction', labelVi: 'Văn học tinh hoa', count: '1.420 Đầu sách', icon: 'book_4' },
  { name: 'Tech & Coding', labelVi: 'Kỹ thuật & Công nghệ', count: '890 Đầu sách', icon: 'terminal' },
  { name: 'Sci-Fi & Fantasy', labelVi: 'Khoa học viễn tưởng', count: '1.110 Đầu sách', icon: 'rocket_launch' },
  { name: 'Self-Growth', labelVi: 'Phát triển bản thân', count: '640 Đầu sách', icon: 'psychology' },
  { name: 'History & Mind', labelVi: 'Lịch sử & Tư duy', count: '780 Đầu sách', icon: 'account_balance' },
  { name: 'Graphic Novels', labelVi: 'Tiểu thuyết đồ họa', count: '420 Đầu sách', icon: 'draw' },
];

interface CuratedGenresSectionProps {
  onSelectGenre: (genreName: string) => void;
}

export const CuratedGenresSection: React.FC<CuratedGenresSectionProps> = ({ onSelectGenre }) => {
  return (
    <section
      id="home-curated-genres"
      data-testid="home-curated-genres-section"
      className="w-full px-gutter-lg py-space-md"
    >
      <div className="flex items-center justify-between mb-space-md">
        <div>
          <h2
            data-testid="home-curated-genres-heading"
            className="font-title-lg text-title-lg text-primary tracking-tight"
          >
            Thể loại tuyển chọn
          </h2>
          <p
            data-testid="home-curated-genres-subtitle"
            className="font-body-md text-body-md text-secondary"
          >
            Khám phá các bộ sưu tập chọn lọc từ công nghệ, nghệ thuật đến văn học kinh điển
          </p>
        </div>
        <Link
          to="/catalog"
          data-path="catalog"
          data-testid="home-curated-genres-link-all"
          className="font-label-lg text-label-lg text-primary hover:underline flex items-center gap-1"
        >
          <span>Xem toàn bộ danh mục sách</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </Link>
      </div>

      <div
        data-testid="home-curated-genres-grid"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-md"
      >
        {CURATED_GENRES.map((genre) => (
          <div
            key={genre.name}
            data-path="catalog"
            data-testid={`home-curated-genres-card-${genre.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            onClick={() => onSelectGenre(genre.name)}
            className="group flex flex-col items-center text-center p-space-md rounded-2xl bg-surface-container-low hover:bg-secondary-container transition-all shadow-sm cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center mb-space-xs transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[24px]">{genre.icon}</span>
            </div>
            <span className="font-title-sm text-title-sm text-on-surface group-hover:text-on-secondary-container transition-colors">
              {genre.labelVi}
              <span className="sr-only"> ({genre.name})</span>
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {genre.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

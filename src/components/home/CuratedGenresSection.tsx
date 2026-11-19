import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface CuratedGenre {
  id?: string;
  name: string;
  labelVi: string;
  count: string;
  icon: string;
}

const DEFAULT_CURATED_GENRES: CuratedGenre[] = [
  { id: 'cat_01', name: 'Literary Fiction', labelVi: 'Văn học tinh hoa', count: '1.420 Đầu sách', icon: 'book_4' },
  { id: 'cat_02', name: 'Self-Growth', labelVi: 'Phát triển bản thân', count: '640 Đầu sách', icon: 'psychology' },
  { id: 'cat_03', name: 'Tech & Coding', labelVi: 'Kỹ thuật & Công nghệ', count: '890 Đầu sách', icon: 'terminal' },
  { id: 'cat_04', name: 'Sci-Fi & Fantasy', labelVi: 'Khoa học viễn tưởng', count: '1.110 Đầu sách', icon: 'rocket_launch' },
];

interface CuratedGenresSectionProps {
  onSelectGenre?: (genreName: string) => void;
}

export const CuratedGenresSection: React.FC<CuratedGenresSectionProps> = ({ onSelectGenre }) => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<CuratedGenre[]>(DEFAULT_CURATED_GENRES);

  const handleCategoryClick = (genre: CuratedGenre) => {
    const categoryId = genre.id || genre.name;
    if (onSelectGenre) {
      onSelectGenre(genre.name);
    }
    navigate(`/catalog?category=${encodeURIComponent(categoryId)}`);
  };

  useEffect(() => {
    const fetchSpecificCategories = async () => {
      try {
        const targetCategoryIds = ['cat_01', 'cat_02', 'cat_03', 'cat_04'];
        const categoriesRef = collection(db, 'Categories');

        // Firestore query with 'in' operator to fetch only specified categories
        const q = query(categoriesRef, where('id', 'in', targetCategoryIds));
        let snapshot = await getDocs(q);

        // Fallback: If 'id' field is not directly indexed or documents are keyed by id, query using documentId()
        if (snapshot.empty) {
          const qDocId = query(categoriesRef, where(documentId(), 'in', targetCategoryIds));
          snapshot = await getDocs(qDocId);
        }

        if (!snapshot.empty) {
          const iconMap: Record<string, string> = {
            cat_01: 'book_4',
            cat_02: 'psychology',
            cat_03: 'terminal',
            cat_04: 'rocket_launch',
          };

          const mapped: CuratedGenre[] = snapshot.docs.map((d) => {
            const data = d.data();
            const catId = data.id || d.id;
            const name = data.nameCategories || data.name || catId;
            return {
              id: catId,
              name,
              labelVi: name,
              count: data.count || 'Tuyển tập đặc biệt',
              icon: iconMap[catId] || 'auto_stories',
            };
          });

          setGenres(mapped);
        }
      } catch (err) {
        console.warn('[CuratedGenresSection] Error querying Categories with `in` operator:', err);
      }
    };

    fetchSpecificCategories();
  }, []);

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
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-space-md"
      >
        {genres.map((genre) => (
          <div
            key={genre.id || genre.name}
            data-path="catalog"
            data-testid={`home-curated-genres-card-${genre.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            onClick={() => handleCategoryClick(genre)}
            className="group flex flex-col items-center text-center p-space-md rounded-2xl bg-surface-container-low hover:bg-secondary-container transition-all shadow-sm cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center mb-space-xs transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[24px]">{genre.icon}</span>
            </div>
            <span className="font-title-sm text-title-sm text-on-surface group-hover:text-on-secondary-container transition-colors line-clamp-1">
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

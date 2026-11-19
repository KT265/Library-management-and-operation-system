import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

export interface FilterSidebarProps {
  filterQuery: string;
  onFilterQueryChange: (query: string) => void;
  onClearSearch: () => void;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  pricePreset: '0-20' | '20-50' | '50+' | null;
  onPriceChipClick: (chip: '0-20' | '20-50' | '50+') => void;
  priceDisplayText: string;
  selectedRating: number | null;
  onSelectRating: (rating: number | null) => void;
  onResetFilters: () => void;
  onApplyFilters?: () => void;
  isMobileDrawer?: boolean;
}

export interface FilterCategoryItem {
  id: string;
  name: string;
  labelVi: string;
}

const FALLBACK_CATEGORIES: FilterCategoryItem[] = [
  { id: 'cat_01', name: 'Literary Fiction', labelVi: 'Văn học tinh hoa' },
  { id: 'cat_02', name: 'Self-Growth', labelVi: 'Phát triển bản thân' },
  { id: 'cat_03', name: 'Tech & Coding', labelVi: 'Kỹ thuật & Công nghệ' },
  { id: 'cat_04', name: 'Sci-Fi & Fantasy', labelVi: 'Khoa học viễn tưởng' },
  { id: 'Computer Science', name: 'Computer Science', labelVi: 'Khoa học máy tính & Kỹ thuật' },
  { id: 'Psychology & Habits', name: 'Psychology & Habits', labelVi: 'Tâm lý học & Thói quen' },
  { id: 'Business & Strategy', name: 'Business & Strategy', labelVi: 'Kinh doanh & Chiến lược' },
  { id: 'Design & Visual Arts', name: 'Design & Visual Arts', labelVi: 'Thiết kế & Nghệ thuật thị giác' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterQuery,
  onFilterQueryChange,
  onClearSearch,
  selectedCategories,
  onToggleCategory,
  pricePreset,
  onPriceChipClick,
  priceDisplayText,
  selectedRating: _selectedRating,
  onSelectRating: _onSelectRating,
  onResetFilters,
  onApplyFilters,
  isMobileDrawer = false,
}) => {
  const [categories, setCategories] = useState<FilterCategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        // Dynamically fetch ALL categories from the Categories collection without limit or hardcoding
        const categoriesRef = collection(db, 'Categories');
        const snapshot = await getDocs(categoriesRef);

        if (!snapshot.empty) {
          const items: FilterCategoryItem[] = snapshot.docs.map((d) => {
            const data = d.data();
            const id = data.id || d.id;
            const name = data.nameCategories || data.name || data.labelVi || id;
            return {
              id,
              name,
              labelVi: name,
            };
          });

          if (isMounted) {
            setCategories(items);
          }
        } else {
          if (isMounted) {
            setCategories(FALLBACK_CATEGORIES);
          }
        }
      } catch (err) {
        console.warn('[FilterSidebar] Error fetching categories from Firestore:', err);
        if (isMounted) {
          setCategories(FALLBACK_CATEGORIES);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside
      id="filterSidebar"
      data-testid="catalog-filter-sidebar"
      className={`${
        isMobileDrawer ? 'flex' : 'hidden lg:flex'
      } flex-col gap-space-lg bg-surface-container-low p-space-lg rounded-3xl shadow-sm`}
    >
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
          <h2 className="font-title-md text-title-md font-bold text-primary tracking-tight">
            Bộ lọc đang chọn
          </h2>
        </div>
        <button
          type="button"
          id="resetAllFilters"
          data-testid="catalog-filter-sidebar-btn-reset"
          onClick={onResetFilters}
          className="font-label-md text-label-md text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer"
        >
          Đặt lại
          <span className="sr-only"> (Reset)</span>
        </button>
      </div>

      {/* Keyword Search in Filter Rail */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
          search
        </span>
        <input
          id="sidebarSearchInput"
          data-testid="catalog-filter-sidebar-input-search"
          type="text"
          value={filterQuery}
          placeholder="Tìm kiếm trong danh mục..."
          aria-label="Filter current page..."
          onChange={(e) => onFilterQueryChange(e.target.value)}
          className="w-full bg-surface-container-lowest rounded-full pl-10 pr-9 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {filterQuery && (
          <button
            type="button"
            id="clearSearchBtn"
            data-testid="catalog-filter-sidebar-btn-clear-search"
            onClick={onClearSearch}
            className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-[16px] cursor-pointer"
          >
            cancel
          </button>
        )}
      </div>

      {/* Category Section: Genres & Disciplines */}
      <div className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider text-[11px]">
            Chủ đề / Chuyên mục
            <span className="sr-only"> (Genres &amp; Disciplines)</span>
          </span>
          {isLoadingCategories && (
            <div className="w-3.5 h-3.5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          )}
        </div>
        <div className="space-y-1.5">
          {categories.map((category) => {
            const isChecked =
              selectedCategories.includes(category.id) ||
              selectedCategories.includes(category.name);

            return (
              <label
                key={category.id}
                data-testid={`catalog-filter-category-${category.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (selectedCategories.includes(category.id)) {
                        onToggleCategory(category.id);
                      } else if (selectedCategories.includes(category.name)) {
                        onToggleCategory(category.name);
                      } else {
                        onToggleCategory(category.id);
                      }
                    }}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                    {category.labelVi}
                    <span className="sr-only"> ({category.id})</span>
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider & Presets */}
      <div className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-title-sm text-title-sm font-bold text-on-surface uppercase tracking-wider text-[11px]">
            Khoảng giá (₫)
            <span className="sr-only"> (Price Threshold)</span>
          </span>
          <span
            className="font-label-md text-label-md font-bold text-primary num-tabular"
            id="priceDisplay"
            data-testid="catalog-filter-sidebar-input-price"
          >
            {priceDisplayText}
          </span>
        </div>

        {/* Quick Chips */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {(['0-20', '20-50', '50+'] as const).map((chip) => {
            const labelVi =
              chip === '0-20' ? 'Dưới 100k' : chip === '20-50' ? '100k – 300k' : 'Trên 300k';
            const legacyLabel = chip === '0-20' ? '0 – 20' : chip === '20-50' ? '20 – 50' : '50+';
            const isActive = pricePreset === chip;
            return (
              <button
                key={chip}
                type="button"
                data-testid={`catalog-filter-chip-${chip}`}
                onClick={() => onPriceChipClick(chip)}
                className={`quick-price-chip py-1 px-1 rounded-full text-center font-label-sm text-label-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container'
                }`}
              >
                <span>{labelVi}</span>
                <span className="sr-only"> ({legacyLabel})</span>
              </button>
            );
          })}
        </div>

        {/* Double Range Slider Graphic */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 bg-surface-container-lowest rounded-2xl px-3 py-1.5 shadow-sm">
            <span className="block font-label-sm text-label-sm text-outline">Tối thiểu</span>
            <span className="font-label-md text-label-md font-bold text-on-surface num-tabular">50.000 ₫</span>
          </div>
          <span className="text-outline text-body-sm font-bold">—</span>
          <div className="flex-1 bg-surface-container-lowest rounded-2xl px-3 py-1.5 shadow-sm">
            <span className="block font-label-sm text-label-sm text-outline">Tối đa</span>
            <span className="font-label-md text-label-md font-bold text-on-surface num-tabular">500.000 ₫</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      

      {/* Bottom Action Buttons */}
      <div className="pt-space-sm flex flex-col gap-2">
        <button
          type="button"
          id="applyFilterBtn"
          data-testid="catalog-filter-sidebar-btn-apply"
          aria-label="Apply Refinements"
          onClick={onApplyFilters}
          className="w-full py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          <span>Áp dụng bộ lọc</span>
          <span className="sr-only"> (Apply Refinements)</span>
        </button>
        <button
          type="button"
          id="clearFilterBtn"
          data-testid="catalog-filter-sidebar-btn-clear"
          aria-label="Clear All Filters"
          onClick={onResetFilters}
          className="w-full py-2.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all cursor-pointer"
        >
          Xóa tất cả
        </button>
      </div>
    </aside>
  );
};

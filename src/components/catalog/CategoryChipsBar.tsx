import React from 'react';

interface CategoryChipsBarProps {
  categories: { id: string; labelVi: string; englishName: string }[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryChipsBar: React.FC<CategoryChipsBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div
      id="catalog-category-chips"
      data-testid="catalog-category-chips-bar"
      className="w-full overflow-x-auto py-space-xs no-scrollbar flex items-center gap-space-xs"
    >
      <button
        type="button"
        data-testid="catalog-chip-all"
        onClick={() => onSelectCategory(null)}
        className={`px-space-md py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-all cursor-pointer ${
          selectedCategory === null
            ? 'bg-primary text-on-primary font-bold shadow-sm'
            : 'bg-surface-container-low text-on-surface hover:bg-secondary-container'
        }`}
      >
        Tất cả
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.englishName;
        return (
          <button
            key={cat.id}
            type="button"
            data-testid={`catalog-chip-${cat.id}`}
            onClick={() => onSelectCategory(isSelected ? null : cat.englishName)}
            className={`px-space-md py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-all cursor-pointer ${
              isSelected
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-low text-on-surface hover:bg-secondary-container'
            }`}
          >
            {cat.labelVi}
            <span className="sr-only"> ({cat.englishName})</span>
          </button>
        );
      })}
    </div>
  );
};

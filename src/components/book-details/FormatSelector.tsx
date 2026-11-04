import React from 'react';
import { formatVND } from '../../utils/currency';

export type BookFormatType = 'hardcover' | 'paperback' | 'ebook';

export interface FormatDetails {
  id: BookFormatType;
  label: string;
  labelVi: string;
  subLabelVi: string;
  price: number;
  originalPrice: number;
}

interface FormatSelectorProps {
  formatOptions: FormatDetails[];
  selectedFormat: BookFormatType;
  onSelectFormat: (format: BookFormatType) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  formatOptions,
  selectedFormat,
  onSelectFormat,
}) => {
  return (
    <div
      id="formatSelector"
      data-testid="book-details-format-selector"
      className="flex flex-col gap-space-xs"
    >
      <span className="font-label-md text-label-md font-bold text-on-surface">
        Chọn định dạng ấn phẩm:
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
        {formatOptions.map((fmt) => {
          const isSelected = selectedFormat === fmt.id;
          return (
            <button
              key={fmt.id}
              type="button"
              data-format={fmt.id}
              data-testid={`book-details-format-btn-${fmt.id}`}
              onClick={() => onSelectFormat(fmt.id)}
              className={`flex flex-col items-start p-space-md rounded-2xl border-2 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20'
                  : 'border-outline-variant/60 bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-title-sm text-title-sm font-bold text-primary">
                  {fmt.labelVi}
                </span>
                {isSelected ? (
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    check_circle
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border border-outline-variant" />
                )}
              </div>

              <span className="font-body-sm text-body-sm text-secondary mb-2 line-clamp-1">
                {fmt.subLabelVi}
              </span>

              <div className="mt-auto">
                <span className="font-title-md text-title-md font-bold text-primary num-tabular">
                  {formatVND(fmt.price)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

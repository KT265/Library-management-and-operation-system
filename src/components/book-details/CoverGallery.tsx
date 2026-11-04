import React from 'react';

export interface GalleryThumbnail {
  id: string;
  label: string;
  labelVi: string;
  url: string;
  alt: string;
}

interface CoverGalleryProps {
  currentCover: string;
  bookTitle: string;
  pages: number;
  isZoomed: boolean;
  onToggleZoom: () => void;
  thumbnails: GalleryThumbnail[];
  activeThumbIndex: number;
  onSelectThumb: (index: number) => void;
}

export const CoverGallery: React.FC<CoverGalleryProps> = ({
  currentCover,
  bookTitle,
  pages,
  isZoomed,
  onToggleZoom,
  thumbnails,
  activeThumbIndex,
  onSelectThumb,
}) => {
  return (
    <div
      id="book-cover-gallery"
      data-testid="book-details-gallery-container"
      className="flex flex-col gap-space-md"
    >
      {/* Main Visual Stage */}
      <div
        id="mainCoverStage"
        data-testid="book-details-gallery-stage"
        className="relative w-full aspect-[3/4] max-w-lg mx-auto rounded-3xl overflow-hidden bg-surface-container-high shadow-xl border border-outline-variant/30 group"
      >
        <img
          id="mainCoverImg"
          data-testid="book-details-gallery-main-img"
          src={currentCover}
          alt={bookTitle}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
          }`}
          onClick={onToggleZoom}
        />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          <span
            data-testid="book-details-badge-guide"
            className="px-3 py-1 rounded-full bg-primary/80 backdrop-blur-md text-on-primary font-label-sm text-label-sm font-bold shadow-sm"
          >
            Chuyên khảo kinh điển
            <span className="sr-only"> (Definitive Guide)</span>
          </span>
          <span
            data-testid="book-details-badge-pages"
            className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-sm text-label-sm font-semibold shadow-sm"
          >
            {pages} trang
            <span className="sr-only"> ({pages} Pages)</span>
          </span>
        </div>

        {/* Zoom Trigger Button */}
        <button
          type="button"
          id="zoomBtn"
          data-testid="book-details-gallery-btn-zoom"
          aria-label="Phóng to ảnh bìa"
          onClick={onToggleZoom}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary flex items-center justify-center shadow-md hover:bg-surface-container-lowest transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isZoomed ? 'zoom_out' : 'zoom_in'}
          </span>
        </button>
      </div>

      {/* 4 Interactive Thumbnail Previews */}
      <div
        data-testid="book-details-gallery-thumbs"
        className="grid grid-cols-4 gap-space-xs max-w-lg mx-auto w-full"
      >
        {thumbnails.map((thumb, index) => {
          const isActive = activeThumbIndex === index;
          return (
            <button
              key={thumb.id}
              type="button"
              data-testid={`book-details-gallery-thumb-${thumb.id}`}
              data-caption={thumb.label}
              onClick={() => onSelectThumb(index)}
              className={`gallery-thumb relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                isActive
                  ? 'active-thumb border-primary shadow-md scale-102 ring-2 ring-primary/20'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-outline-variant'
              }`}
            >
              <img
                src={thumb.url}
                alt={thumb.alt}
                className="w-full h-full object-cover"
              />
              <span className="sr-only">{thumb.labelVi}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

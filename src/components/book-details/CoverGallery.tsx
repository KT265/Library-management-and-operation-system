import React, { useState } from 'react';

export interface GalleryThumbnail {
  id: string;
  label: string;
  labelVi: string;
  url: string;
  alt: string;
}

export interface BookGalleryData {
  imgCoverPage?: string;
  imgs?: string[];
  [key: string]: any;
}

interface CoverGalleryProps {
  bookData?: BookGalleryData;
  currentCover?: string;
  bookTitle?: string;
  pages?: number;
  isZoomed?: boolean;
  onToggleZoom?: () => void;
  thumbnails?: GalleryThumbnail[];
  activeThumbIndex?: number;
  onSelectThumb?: (index: number) => void;
}

export const CoverGallery: React.FC<CoverGalleryProps> = ({
  bookData,
  currentCover: propCurrentCover,
  bookTitle = 'Ấn phẩm',
  pages = 300,
  isZoomed = false,
  onToggleZoom,
  thumbnails,
  activeThumbIndex,
  onSelectThumb,
}) => {
  // Resolving bookData: prioritize passed bookData, fallback to props/thumbnails
  const resolvedBookData: BookGalleryData = bookData || {
    imgCoverPage: propCurrentCover || (thumbnails && thumbnails[0]?.url) || '',
    imgs: thumbnails && thumbnails.length > 1 ? thumbnails.slice(1).map((t) => t.url) : [],
  };

  // Merge the two schema fields into a single combined array:
  // imgCoverPage (main cover) and imgs (additional gallery images)
  const allImages: string[] = [
    resolvedBookData.imgCoverPage,
    ...(resolvedBookData.imgs || []),
  ].filter((img): img is string => typeof img === 'string' && img.trim() !== '');

  // Handle case where allImages may be empty or undefined
  const galleryImages =
    allImages.length > 0
      ? allImages
      : propCurrentCover
      ? [propCurrentCover]
      : ['/assets/images/book-placeholder.jpg'];

  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const activeIndex = typeof activeThumbIndex === 'number' ? activeThumbIndex : selectedIdx;

  const activeCoverUrl =
    galleryImages[activeIndex] || galleryImages[0] || propCurrentCover || '';

  const handleSelect = (index: number) => {
    setSelectedIdx(index);
    if (onSelectThumb) {
      onSelectThumb(index);
    }
  };

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
          src={activeCoverUrl}
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

      {/* Complete Image Gallery (mapped from allImages) */}
      <div
        data-testid="book-details-gallery-thumbs"
        className="grid grid-cols-4 gap-space-xs max-w-lg mx-auto w-full"
      >
        {galleryImages.map((imageUrl, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={`thumb-${index}`}
              type="button"
              data-testid={`book-details-gallery-thumb-${index}`}
              data-caption={index === 0 ? 'Front Cover Original' : `Gallery Image ${index}`}
              onClick={() => handleSelect(index)}
              className={`gallery-thumb relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                isActive
                  ? 'active-thumb border-primary shadow-md scale-102 ring-2 ring-primary/20'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-outline-variant'
              }`}
            >
              <img
                src={imageUrl}
                alt={`${bookTitle} - ${index === 0 ? 'Bìa chính' : `Ảnh ${index}`}`}
                className="w-full h-full object-cover"
              />
              <span className="sr-only">
                {index === 0 ? 'Bìa trước nguyên bản' : `Ảnh chi tiết ${index}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

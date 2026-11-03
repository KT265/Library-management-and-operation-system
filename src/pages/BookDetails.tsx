import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_BOOKS } from '../data/mockData';
import { useStore } from '../store/useStore';
import { Book } from '../types';

interface FormatOption {
  id: 'hardcover' | 'paperback' | 'ebook';
  label: string;
  subLabel: string;
  price: number;
  originalPrice: number;
}

const GALLERY_THUMBNAILS = [
  {
    id: 'front',
    label: 'Front Cover Original',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTvQXFI2eOxiw-mX5BtGITzJqbrTJRfdtnITBPipyoBiaNzug3GmDkPW_SqqkMir_LUc2CXLuiGFtzMkyBZq9OHvRZxIPcG6w5fvU3GELlXnOE594wVUJ0yYMtr8-J1U-8hMhtqYmOSKmUJjeCETCp9Yul7Hbj_hUwO-UtdogSUQb6NJ6q9-ITwWwwwCr-EEySb8EgXEPQtAEEQos9_ydaRQrgt2j7tb3EHhO_Vj8C',
    alt: 'Front cover view of technical book with clear title text and wild boar graphic',
  },
  {
    id: 'toc',
    label: 'Index & Chapter Overview',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO9nNRFwV7RrOGpzy0eWTs7DWQdyaBTS1hQ-jwK1d3hfxU2kXWpVdH7j7wmor4k7unGrBdaUu8p7w7VUArv3PqRka2OMVNm8HKiElTo-Oa2G5xmSGVjF7EYNsDH01AlY1qJaJT1JVJQPWGM-u535Y9S9FJB7s6udOrp_iUzIA4AlSuvDV48U-Ajczz7aUAS06j0Qu9kGpUr41v6DncNOJuZ6PwhXHPkYEsHk0a_H1o',
    alt: 'Interior book preview page showing detailed clean typographic table of contents and chapter headings on technical architecture',
  },
  {
    id: 'diagram',
    label: 'System Architecture Diagram Spread',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvG4fzf3efVoKybJMlCQfPqGZ2xkjNbjG-G81vPuMxxI7CXJxGZrwMwJZi-1b0tWZ6JVsoiohJBD6q3xJbd5w_WGubUYC9SvaQwSaZOwbOgPrqspr5xf4Ppn2JPhMNM9Q333rm7atEJx7Izjv_3OIstMx2OI0nLz2GKcI--VSC5iSvNNjjjZ0D4QcS13gtmU4SyrXsBQ9TFbXDvfzNEU2PAVy1LQ-NB9md4HU2e9nO',
    alt: 'Book centerfold layout illustrating distributed data storage topologies, replication log models, and consensus diagrams',
  },
  {
    id: 'back',
    label: 'Back Cover & Peer Endorsements',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAktEUxeMjFZzO8oFgjcrRGxm5Ty5pvWyDA_Fctk38vuaj0FqoMGb5OIpVRctqyp2ryXuaA1aYAPCUIFEQb9bBxoqQCxvIx2m1kOkJK_V7NhVwwUk4qhl_aghao6hABH5zd4-dqJRRjLTtZIftqrNnUmgCZnPpX5WgKl_8Jxx5-8gi4apfw0PC00Gw3J3rEgVne1tjqmHhl1-kAldJ8R-swgMEQoyCyA7LdE15b42XO',
    alt: 'Back cover of technical handbook showcasing editorial endorsements from leading software engineers and distributed system architects',
  },
];

const RECOMMENDED_BOOKS = [
  {
    id: 'rec-1',
    title: 'Database Internals',
    author: 'Alex Petrov',
    tag: "O'Reilly",
    price: 49.99,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAoaQ72umhvclAxXCXBmasus2nRUktnHzPZIc3cfNy3AhrB8Sq2CGSQejF-Nc0OILh-f_-aKhMWGaOhGqurRvk8V4KTsdvc3YkLJsON5t9xp-Dqc-Si6FQVQujEL_1CIZJX4il-eWPURRu9LMeBrPpLoAPU6DDfpd0nowIyT5b9aw4T_8da6Q3tSzUBH_o4mzYtCxfaNcTH06_JqlNNBZfPkF5wnau5njxikN6N5mId',
    description: 'A deep dive into how distributed and relational storage engines work.',
  },
  {
    id: 'rec-2',
    title: 'System Design Interview (Vol. 1)',
    author: 'Alex Xu',
    tag: 'Top Seller',
    price: 38.25,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBR6DJ8yIDuRSV6f3J86l5aLnvtorxomeE6p88UK1AkxyBh7mRmWJRqya7kLX4Mh08LHQwn8a5J7P57o7q4apZ-5HYmNBrRpX84nC3GPgo1W8OCKuI0stj2jCXYqLx0Le4mlARXWSCpv_l5UDxihn9SflTqLv3i3qsExcsTblLTDfcLWGkrNscYuaRypuSoDM8kn3KWKP0K6y4vh_1RI9satQ5LEO9ntqGBBSGQVOGD',
    description: "An insider's step-by-step visual blueprint for enterprise architecture.",
  },
  {
    id: 'rec-3',
    title: 'Site Reliability Engineering',
    author: 'Niall Richard Murphy et al.',
    tag: 'Google Press',
    price: 44.0,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDnQMj4z_B6VYPjbAMa-nRU9vUNImOjHrRVM2UyABuLiRBo5Eh08OUqTM0gVN10ab4ZCKfxdcR-YJyKCx5etxDzKjFmoSdYtTiL3qUK-r7AH9Ha2nXiR1Pt60XFUxll6soKK_PaHsHiwSXnKx4IDMYXbFDAdUHVnfsJXLIyk1QUJnmq5nX4HbfyJNRDOE4WaV8OsQYEXIGWYG_h-2c5sP-TYRbq4iNQulZ0sKUnZ6Mf',
    description: 'How Google runs production systems at massive global scale.',
  },
  {
    id: 'rec-4',
    title: 'Building Microservices',
    author: 'Sam Newman',
    tag: '2nd Edition',
    price: 47.5,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1kBO8fCsjEbHzC_4Wm0bJa1SaNQPmAre5qCF7H4RdFVS17fstYzu4HA9cdMa6Q0KaCdrrQMh6AEG-lFdqMl_1Kq0gCKlGPaMmWmAzQPEzh6D_oZiRW0PhUVtn-8GJ_Xc6WvEhg5jSG8nTOIfvFj-jaVhe3KjV5ZkERTws4TnZcoZAKb9MuImIij9--GCwJqtAovVedy9se1DGCHG7s6ArVf3z8McHX6Xab0sgbsDd',
    description: 'Designing fine-grained systems, service boundaries, and event queues.',
  },
];

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const recContainerRef = useRef<HTMLDivElement>(null);

  // Book Selection
  const canonicalBook = MOCK_BOOKS.find((b) => b.id === id) || MOCK_BOOKS[0];

  // Component State
  const [selectedFormat, setSelectedFormat] = useState<'hardcover' | 'paperback' | 'ebook'>('paperback');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'tab-overview' | 'tab-specs' | 'tab-reviews' | 'tab-author'>('tab-overview');
  const [activeThumbIndex, setActiveThumbIndex] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Format pricing options (Stitch Screen 9d69df7c exact prices for book-1, dynamically scaled for other books)
  const basePrice = canonicalBook.price || 38.99;
  const formatOptions: FormatOption[] = [
    {
      id: 'hardcover',
      label: 'Hardcover',
      subLabel: 'Library Bound',
      price: canonicalBook.id === 'book-1' ? 58.0 : +(basePrice * 1.35).toFixed(2),
      originalPrice: canonicalBook.id === 'book-1' ? 65.0 : +(basePrice * 1.55).toFixed(2),
    },
    {
      id: 'paperback',
      label: 'Paperback',
      subLabel: 'Lay-flat Binding',
      price: canonicalBook.id === 'book-1' ? 42.5 : basePrice,
      originalPrice: canonicalBook.id === 'book-1' ? 49.99 : (canonicalBook.originalPrice || +(basePrice * 1.25).toFixed(2)),
    },
    {
      id: 'ebook',
      label: 'Kindle / ePub',
      subLabel: 'Instant Sync',
      price: canonicalBook.id === 'book-1' ? 34.99 : +(basePrice * 0.85).toFixed(2),
      originalPrice: canonicalBook.id === 'book-1' ? 39.99 : +(basePrice * 1.05).toFixed(2),
    },
  ];

  // Pricing calculations
  const activeFormatObj = formatOptions.find((f) => f.id === selectedFormat) || formatOptions[1];
  const unitPrice = activeFormatObj.price;
  const originalPrice = activeFormatObj.originalPrice;
  const subtotal = (unitPrice * quantity).toFixed(2);

  // Quantity handlers
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < (canonicalBook.stockCount || 38)) {
      setQuantity((q) => q + 1);
    }
  };

  // Add to Bag with visual button feedback
  const handleAddToCart = () => {
    setIsAdding(true);
    const itemToAdd: Book = {
      ...canonicalBook,
      price: unitPrice,
      originalPrice: originalPrice,
    };
    addToCart(itemToAdd, quantity);

    setTimeout(() => {
      setIsAdding(false);
    }, 1400);
  };

  // Direct checkout
  const handleBuyNow = () => {
    const itemToAdd: Book = {
      ...canonicalBook,
      price: unitPrice,
      originalPrice: originalPrice,
    };
    addToCart(itemToAdd, quantity);
    navigate('/checkout');
  };

  // Recommendations scroller
  const handleScrollLeft = () => {
    if (recContainerRef.current) {
      recContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (recContainerRef.current) {
      recContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // Current cover image
  const currentCover =
    activeThumbIndex === 0
      ? canonicalBook.coverImage
      : GALLERY_THUMBNAILS[activeThumbIndex]?.url || canonicalBook.coverImage;

  return (
    <div className="flex flex-col w-full">
      {/* Dynamic Gradient Glow Background Layer */}
      <div className="relative w-full max-w-7xl mx-auto px-gutter-sm md:px-gutter-lg pb-space-xxl">
        {/* 1. Breadcrumb Ribbon */}
        <nav
          aria-label="Breadcrumb"
          className="py-space-md flex items-center space-x-2 text-on-surface-variant font-label-md text-label-md overflow-x-auto whitespace-nowrap"
        >
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            data-path="home"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </Link>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <Link
            to="/catalog"
            className="hover:text-primary transition-colors cursor-pointer"
            data-path="catalog"
          >
            Computer Science
          </Link>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <Link
            to="/catalog"
            className="hover:text-primary transition-colors cursor-pointer"
            data-path="catalog"
          >
            {canonicalBook.genre || 'Distributed Systems'}
          </Link>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span className="text-on-surface font-title-sm text-title-sm truncate max-w-xs md:max-w-md">
            {canonicalBook.title}
          </span>
        </nav>

        {/* 2. Main Product Showcase Grid (12-Column Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Visual Gallery Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Main Book Visual Stage */}
            <div className="relative group bg-surface-container-low rounded-xl p-space-lg flex items-center justify-center shadow-sm overflow-hidden">
              <div className="absolute -top-24 -left-24 w-60 h-60 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-tertiary-fixed-dim/20 rounded-full blur-3xl pointer-events-none" />

              {/* Zoom & Spec Badges Overlay */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-tertiary text-on-tertiary rounded-full font-label-sm text-label-sm uppercase tracking-wider shadow-sm">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  Definitive Guide
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-surface-container-highest text-on-surface-variant rounded-full font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[14px]">auto_stories</span>{' '}
                  {canonicalBook.specs?.pages || 616} Pages
                </span>
              </div>

              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface flex items-center justify-center shadow-md hover:bg-surface-container-lowest hover:scale-105 active:scale-95 transition-all cursor-pointer"
                id="zoomBtn"
                title="Inspect Cover Details"
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isZoomed ? 'zoom_out' : 'zoom_in'}
                </span>
              </button>

              {/* Book Stand Graphic */}
              <div
                className={`relative py-4 px-2 max-w-[340px] w-full transition-transform duration-300 ${
                  isZoomed ? 'scale-110' : 'group-hover:-translate-y-1.5'
                }`}
              >
                <div className="relative shadow-2xl rounded-r-lg overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-auto aspect-[3/4] object-cover object-center transform transition duration-500 hover:scale-105"
                    id="mainCoverImg"
                    src={currentCover}
                    alt={canonicalBook.title}
                  />
                </div>
                {/* Physical Depth Spine Accent */}
                <div className="absolute inset-y-4 left-0 w-2.5 bg-gradient-to-r from-primary to-transparent opacity-30 rounded-l pointer-events-none" />
              </div>
            </div>

            {/* Thumbnail Gallery Strip */}
            <div className="grid grid-cols-4 gap-space-sm">
              {GALLERY_THUMBNAILS.map((thumb, index) => {
                const isActive = activeThumbIndex === index;
                return (
                  <button
                    key={thumb.id}
                    type="button"
                    onClick={() => setActiveThumbIndex(index)}
                    className={`gallery-thumb group relative aspect-[3/4] rounded-lg bg-surface-container overflow-hidden p-1 shadow-sm transition-all focus:outline-none cursor-pointer ${
                      isActive ? 'active-thumb ring-2 ring-primary' : 'hover:ring-1 hover:ring-outline-variant'
                    }`}
                    data-caption={thumb.label}
                  >
                    <img
                      className="w-full h-full object-cover rounded"
                      src={thumb.url}
                      alt={thumb.alt}
                    />
                    <div
                      className={`absolute inset-0 rounded transition-colors ${
                        isActive ? 'bg-primary/10' : 'bg-black/5 group-hover:bg-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Quick Guarantee Bar */}
            <div className="flex items-center justify-between p-space-md bg-surface-container-low rounded-lg text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
                <span>Genuine O'Reilly Print</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">local_shipping</span>
                <span>Next-day Dispatched</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">undo</span>
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Information & Commerce Column (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-space-lg">
            {/* Header & Classification Ribbon */}
            <div className="space-y-space-xs">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-semibold">
                  <span className="material-symbols-outlined text-[16px]">domain</span>
                  {canonicalBook.publisher || "O'Reilly Media"}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">
                  1st Edition (Gold Standard)
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> #1 in
                  Distributed Computing
                </span>
              </div>

              <h1 className="font-display-md text-display-md text-on-surface tracking-tight mt-space-xs">
                {canonicalBook.title}
              </h1>

              <p className="font-title-lg text-title-lg text-on-surface-variant">
                {canonicalBook.subtitle ||
                  'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems'}
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-space-xs">
                <div className="flex items-center gap-1.5 text-on-surface">
                  <span className="font-body-md text-body-md text-on-surface-variant">By</span>
                  <a
                    className="font-title-md text-title-md text-primary-container underline decoration-secondary-container decoration-2 underline-offset-4 hover:text-primary transition-colors"
                    href="#tab-author"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('tab-author');
                    }}
                  >
                    {canonicalBook.author}
                  </a>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                {/* Ratings Lockup */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-500">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star_half
                    </span>
                  </div>
                  <span className="font-title-md text-title-md text-on-surface font-bold">
                    {canonicalBook.rating || 4.9}
                  </span>
                  <a
                    className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary underline transition-colors"
                    href="#reviews-section"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('tab-reviews');
                      const el = document.getElementById('reviews-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    (1,420 reader reviews)
                  </a>
                </div>
              </div>
            </div>

            {/* Topics & Taxonomy Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">
                Replication &amp; Consensus
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">
                Partitioning
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">
                Transactions &amp; ACID
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">
                Stream Processing
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">
                Batch Workflows
              </span>
            </div>

            {/* Commerce Master Card (Pricing + Formats + CTA) */}
            <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-md space-y-space-md">
              {/* Price & Stock Status Bar */}
              <div className="flex flex-wrap items-baseline justify-between gap-space-sm pb-space-sm bg-surface-container-low/50 p-space-md rounded-lg">
                <div className="flex items-baseline gap-space-sm">
                  <span
                    className="font-display-md text-display-md text-primary font-bold tracking-tight"
                    id="calculatedPrice"
                  >
                    ${unitPrice.toFixed(2)}
                  </span>
                  <span
                    className="font-title-lg text-title-lg text-outline line-through"
                    id="originalPrice"
                  >
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase">
                    Save 15%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    In Stock{' '}
                    <span className="font-normal text-on-surface-variant">
                      ({canonicalBook.stockCount || 38} copies available in warehouse)
                    </span>
                  </span>
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-title-sm text-title-sm text-on-surface">
                    Available Formats
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm" id="formatSelector">
                  {formatOptions.map((fmt) => {
                    const isFmtActive = selectedFormat === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setSelectedFormat(fmt.id)}
                        className={`format-btn flex flex-col p-space-md text-left rounded-lg transition-all cursor-pointer ${
                          isFmtActive
                            ? 'bg-secondary-container text-on-secondary-container shadow-sm active-format'
                            : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                        }`}
                        data-format={fmt.id}
                        data-orig={fmt.originalPrice}
                        data-price={fmt.price}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`font-title-sm text-title-sm ${isFmtActive ? 'font-bold' : ''}`}>
                            {fmt.label}
                          </span>
                          <span
                            className={`material-symbols-outlined text-[18px] check-glyph ${
                              isFmtActive ? 'text-on-secondary-container' : 'text-outline'
                            }`}
                          >
                            {isFmtActive ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                        </div>
                        <span
                          className={`font-label-lg text-label-lg font-bold ${
                            isFmtActive ? '' : 'text-primary'
                          }`}
                        >
                          ${fmt.price.toFixed(2)}
                        </span>
                        <span
                          className={`font-body-sm text-body-sm mt-0.5 ${
                            isFmtActive ? 'opacity-90' : 'text-on-surface-variant'
                          }`}
                        >
                          {fmt.subLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Action Suite */}
              <div className="space-y-space-md pt-space-xs">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between bg-surface-container-low rounded-full px-space-sm py-1 max-w-[170px]">
                    <button
                      aria-label="Decrease quantity"
                      className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shadow-sm disabled:opacity-40 cursor-pointer"
                      disabled={quantity <= 1}
                      id="qtyMinus"
                      onClick={handleDecrement}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <div className="px-space-md flex flex-col items-center">
                      <span
                        className="font-title-md text-title-md font-bold text-on-surface"
                        id="qtyDisplay"
                      >
                        {quantity}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">QTY</span>
                    </div>
                    <button
                      aria-label="Increase quantity"
                      className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shadow-sm cursor-pointer"
                      id="qtyPlus"
                      onClick={handleIncrement}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>

                  {/* Live Total Breakdown Tag */}
                  <div className="hidden sm:flex flex-col justify-center pl-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Subtotal:
                    </span>
                    <span
                      className="font-title-lg text-title-lg font-bold text-primary"
                      id="liveTotal"
                    >
                      ${subtotal}
                    </span>
                  </div>
                </div>

                {/* CTA Command Cluster */}
                <div className="flex flex-wrap sm:flex-nowrap gap-space-sm items-center pt-2">
                  <button
                    className={`flex-1 min-w-[200px] h-12 rounded-full ${
                      isAdding ? 'bg-emerald-700' : 'bg-primary hover:bg-primary-container'
                    } text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer`}
                    id="addToCartBtn"
                    onClick={handleAddToCart}
                    type="button"
                  >
                    {isAdding ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">
                          progress_activity
                        </span>
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="h-12 px-space-xl rounded-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg flex items-center justify-center gap-1.5 hover:bg-secondary-fixed transition-colors cursor-pointer"
                    data-path="cart-checkout"
                    type="button"
                  >
                    <span>Buy Now</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Editorial Tabs & Specifications Section */}
        <div className="mt-space-xxl pt-space-lg">
          {/* Segmented Tab Navigation */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4" role="tablist">
            <button
              onClick={() => setActiveTab('tab-overview')}
              className={`spec-tab px-space-lg py-2.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                activeTab === 'tab-overview'
                  ? 'active-tab bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
              data-target="tab-overview"
              type="button"
            >
              Curator's Overview
            </button>
            <button
              onClick={() => setActiveTab('tab-specs')}
              className={`spec-tab px-space-lg py-2.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                activeTab === 'tab-specs'
                  ? 'active-tab bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
              data-target="tab-specs"
              type="button"
            >
              Full Specifications
            </button>
            <button
              onClick={() => setActiveTab('tab-reviews')}
              className={`spec-tab px-space-lg py-2.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                activeTab === 'tab-reviews'
                  ? 'active-tab bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
              data-target="tab-reviews"
              type="button"
            >
              Reviews &amp; Insights (1,420)
            </button>
            <button
              onClick={() => setActiveTab('tab-author')}
              className={`spec-tab px-space-lg py-2.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                activeTab === 'tab-author'
                  ? 'active-tab bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
              data-target="tab-author"
              type="button"
            >
              About {canonicalBook.author}
            </button>
          </div>

          {/* Tab Panes Container */}
          <div className="mt-space-md">
            {/* PANE 1: OVERVIEW */}
            <div
              className={`tab-pane ${activeTab === 'tab-overview' ? 'block' : 'hidden'}`}
              id="tab-overview"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl bg-surface-container-lowest rounded-xl p-space-xl shadow-sm">
                <div className="lg:col-span-8 space-y-space-md">
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    The modern landmark in distributed system design
                  </h2>
                  <div className="space-y-4 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    <p>
                      {canonicalBook.description ||
                        'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. In addition, we have an overwhelming variety of tools, including relational databases, NoSQL datastores, stream or batch processors, and message brokers. What are the right choices for your application?'}
                    </p>
                    <p>
                      In this practical and comprehensive guide, author <strong>{canonicalBook.author}</strong>{' '}
                      helps you navigate this diverse landscape by examining the pros and cons of
                      various technologies for processing and storing data. Software keeps changing,
                      but the fundamental principles remain the same. With this book, software engineers
                      and architects will learn how to apply those ideas in practice and make full use of
                      modern data infrastructure.
                    </p>
                  </div>

                  {/* Feature Bullet Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                    <div className="p-space-md rounded-lg bg-surface-container-low flex gap-3">
                      <span className="material-symbols-outlined text-primary text-[24px]">hub</span>
                      <div>
                        <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                          Reliable Architectures
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Peer beneath the marketing buzzwords of storage engines to understand storage
                          tradeoffs.
                        </p>
                      </div>
                    </div>
                    <div className="p-space-md rounded-lg bg-surface-container-low flex gap-3">
                      <span className="material-symbols-outlined text-primary text-[24px]">
                        sync_alt
                      </span>
                      <div>
                        <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                          Consensus &amp; Consistency
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Master linearizability, raft, Paxos, and distributed transactions without
                          cognitive overload.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Callout Column */}
                <div className="lg:col-span-4 bg-surface-container-low rounded-lg p-space-lg flex flex-col justify-between space-y-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant uppercase tracking-wider font-bold">
                      Critical Acclaim
                    </span>
                    <blockquote className="font-title-md text-title-md text-on-surface italic mt-space-sm leading-snug">
                      "This is easily the single best engineering book written in the last fifteen
                      years. It translates theoretical academic papers into pragmatic architecture
                      choices."
                    </blockquote>
                    <p className="font-label-md text-label-md text-on-surface-variant mt-space-xs">
                      — Chief Architect, Cloud Infrastructure
                    </p>
                  </div>
                  <div className="pt-space-md bg-surface-container-lowest/70 p-space-md rounded-lg">
                    <div className="flex items-center gap-2 text-primary font-title-sm text-title-sm font-bold">
                      <span className="material-symbols-outlined">menu_book</span>
                      <span>Companion Materials</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Access digital errata, downloadable vector diagrams, and Cambridge University
                      lecture slides.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PANE 2: SPECIFICATIONS */}
            <div
              className={`tab-pane ${activeTab === 'tab-specs' ? 'block' : 'hidden'}`}
              id="tab-specs"
            >
              <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-lg">
                  Technical Metadata &amp; Edition Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">ISBN-13</span>
                    <span className="font-title-md text-title-md text-on-surface font-bold font-mono">
                      {canonicalBook.specs?.isbn || '978-1449373320'}
                    </span>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">ISBN-10</span>
                    <span className="font-title-md text-title-md text-on-surface font-bold font-mono">
                      {canonicalBook.specs?.isbn ? canonicalBook.specs.isbn.replace(/[^0-9X]/gi, '').slice(3) : '1449373321'}
                    </span>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Print Length
                    </span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">
                      {canonicalBook.specs?.pages || 616} Pages
                    </span>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">Language</span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">
                      {canonicalBook.specs?.language || 'English (US Original)'}
                    </span>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Dimensions
                    </span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">
                      {canonicalBook.specs?.dimensions || '7.0 x 1.3 x 9.2 inches'}
                    </span>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Shipping Weight
                    </span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">
                      {canonicalBook.specs?.weight || '2.18 lbs (0.99 kg)'}
                    </span>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Publication Date
                    </span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">
                      {canonicalBook.specs?.publicationYear || 2017}
                    </span>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Publisher
                    </span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">
                      {canonicalBook.specs?.publisher || canonicalBook.publisher || "O'Reilly Media; 1st edition"}
                    </span>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Inventory Classification
                    </span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">
                      QA76.9.D3 K55 2017
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PANE 3: REVIEWS & DISTRIBUTION */}
            <div
              className={`tab-pane ${activeTab === 'tab-reviews' ? 'block' : 'hidden'}`}
              id="tab-reviews"
            >
              <div
                className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm space-y-space-xl"
                id="reviews-section"
              >
                {/* Summary Grid & Bars */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xl items-center">
                  {/* Total Average Score */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-space-lg bg-surface-container-low rounded-xl text-center">
                    <span className="font-display-lg text-display-lg font-bold text-primary">
                      {canonicalBook.rating ? canonicalBook.rating.toFixed(1) : '4.9'}
                    </span>
                    <div className="flex items-center text-amber-500 my-1">
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star_half
                      </span>
                    </div>
                    <span className="font-title-sm text-title-sm text-on-surface-variant">
                      Based on {canonicalBook.reviewCount ? canonicalBook.reviewCount.toLocaleString() : '1,420'} ratings
                    </span>
                    <span className="mt-space-sm inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-label-sm text-label-sm font-semibold">
                      98% Recommended
                    </span>
                  </div>

                  {/* Rating Distribution Histograms */}
                  <div className="md:col-span-8 space-y-2">
                    {/* 5 Stars */}
                    <div className="flex items-center gap-space-sm font-label-md text-label-md">
                      <span className="w-12 text-right text-on-surface">5 stars</span>
                      <div className="flex-1 h-3 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '88%' }} />
                      </div>
                      <span className="w-12 text-on-surface-variant">88%</span>
                    </div>
                    {/* 4 Stars */}
                    <div className="flex items-center gap-space-sm font-label-md text-label-md">
                      <span className="w-12 text-right text-on-surface">4 stars</span>
                      <div className="flex-1 h-3 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className="h-full bg-primary-container rounded-full"
                          style={{ width: '9%' }}
                        />
                      </div>
                      <span className="w-12 text-on-surface-variant">9%</span>
                    </div>
                    {/* 3 Stars */}
                    <div className="flex items-center gap-space-sm font-label-md text-label-md">
                      <span className="w-12 text-right text-on-surface">3 stars</span>
                      <div className="flex-1 h-3 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '2%' }} />
                      </div>
                      <span className="w-12 text-on-surface-variant">2%</span>
                    </div>
                    {/* 2 Stars */}
                    <div className="flex items-center gap-space-sm font-label-md text-label-md">
                      <span className="w-12 text-right text-on-surface">2 stars</span>
                      <div className="flex-1 h-3 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full bg-outline rounded-full" style={{ width: '1%' }} />
                      </div>
                      <span className="w-12 text-on-surface-variant">1%</span>
                    </div>
                    {/* 1 Star */}
                    <div className="flex items-center gap-space-sm font-label-md text-label-md">
                      <span className="w-12 text-right text-on-surface">1 star</span>
                      <div className="flex-1 h-3 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full bg-outline rounded-full" style={{ width: '0.2%' }} />
                      </div>
                      <span className="w-12 text-on-surface-variant">&lt;1%</span>
                    </div>
                  </div>
                </div>

                {/* Featured Reader Comments Mosaic */}
                <div className="space-y-space-md pt-space-md">
                  <h3 className="font-title-lg text-title-lg text-on-surface">Highlighted Reviews</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Review Card 1 */}
                    <div className="p-space-lg rounded-xl bg-surface-container-low space-y-space-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container font-title-sm text-title-sm font-bold flex items-center justify-center">
                            AR
                          </div>
                          <div>
                            <div className="font-title-sm text-title-sm text-on-surface">
                              Alexandre R.
                            </div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">
                              Staff Infrastructure Engineer
                            </div>
                          </div>
                        </div>
                        <span className="font-label-sm text-label-sm text-outline">
                          Verified Purchase
                        </span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        "This book changed the way I interview and construct production
                        architectures. Chapter 5 and 6 on replication lag and partitioning are
                        indispensable."
                      </p>
                    </div>

                    {/* Review Card 2 */}
                    <div className="p-space-lg rounded-xl bg-surface-container-low space-y-space-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed font-title-sm text-title-sm font-bold flex items-center justify-center">
                            DL
                          </div>
                          <div>
                            <div className="font-title-sm text-title-sm text-on-surface">
                              Danielle Lin
                            </div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">
                              Data Platform Lead
                            </div>
                          </div>
                        </div>
                        <span className="font-label-sm text-label-sm text-outline">
                          Verified Purchase
                        </span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        "Required reading for all new software hires at our firm. Unbelievably lucid
                        explanations of difficult consensus problems and event-driven patterns."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANE 4: AUTHOR BIO */}
            <div
              className={`tab-pane ${activeTab === 'tab-author' ? 'block' : 'hidden'}`}
              id="tab-author"
            >
              <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-space-xl items-center md:items-start">
                  <div className="w-36 h-36 rounded-full overflow-hidden bg-surface-container shrink-0 shadow-md">
                    <img
                      className="w-full h-full object-cover"
                      alt={`Portrait photo of ${canonicalBook.author}`}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJqfw6oJbdsSJqwMucMXYp6WP2PqT-C4fTFQYjak_PTzPEkHCyPjxVImTQzgdVk4YaLoc7507ExwsAj3Czwu1UFFw7Lfhmm2sWHiz8a0nAcusHu2GUnTF2CgPP-wkNfa4Hc08LAy3Gr44bFWLulMXA-AxRacl28GbCPrafkDwjLTThB2g1CWaKvCoBNPRtcACSPVwRjvcz24nG4TL2y94nusq_mVOTvsRVGLAuwsJ9"
                    />
                  </div>
                  <div className="space-y-space-sm">
                    <div className="flex flex-wrap items-center gap-space-sm">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        {canonicalBook.author}
                      </h2>
                      <span className="px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                        Author &amp; Researcher
                      </span>
                    </div>
                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                      {canonicalBook.authorBio ||
                        'Martin Kleppmann is an Associate Professor in the Department of Computer Science and Technology at the University of Cambridge, and a Fellow of Churchill College. He is focused on distributed systems, security, and local-first software. Previously he was an active entrepreneur and engineer building large-scale data infrastructures at LinkedIn and Rapportive.'}
                    </p>
                    <div className="pt-space-xs flex items-center gap-space-md font-label-md text-label-md">
                      <a
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                        href="#cambridge-profile"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="material-symbols-outlined text-[16px]">school</span> Cambridge
                        Lab Profile
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                        href="#other-publications"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="material-symbols-outlined text-[16px]">menu_book</span> View 4
                        Other Publications
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Recommendations Carousel Strip: 'Readers Also Purchased' */}
        <div className="mt-space-xxl space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                Curated Complementary Reading
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Readers Also Purchased
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous suggestions"
                className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
                id="recScrollLeft"
                onClick={handleScrollLeft}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                aria-label="Next suggestions"
                className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
                id="recScrollRight"
                onClick={handleScrollRight}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Recommendation Cards Scroller */}
          <div
            className="flex gap-space-lg overflow-x-auto pb-4 scroll-smooth"
            id="recContainer"
            ref={recContainerRef}
          >
            {RECOMMENDED_BOOKS.map((rec) => (
              <div
                key={rec.id}
                className="min-w-[260px] max-w-[280px] bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:-translate-y-1 hover:shadow-md transition-all shrink-0"
              >
                <div className="space-y-space-sm">
                  <div className="aspect-[3/4] bg-surface-container rounded-lg overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover"
                      src={rec.coverImage}
                      alt={rec.title}
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 font-label-sm text-label-sm font-semibold">
                      {rec.tag}
                    </span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {rec.author}
                    </span>
                    <h3 className="font-title-sm text-title-sm text-on-surface font-bold line-clamp-1">
                      {rec.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                      {rec.description}
                    </p>
                  </div>
                </div>

                <div className="pt-space-sm">
                  <button
                    onClick={() => {
                      addToCart(
                        {
                          id: rec.id,
                          title: rec.title,
                          author: rec.author,
                          price: rec.price,
                          coverImage: rec.coverImage,
                          rating: 4.8,
                          reviewCount: 120,
                          inStock: true,
                          stockCount: 15,
                          publisher: "O'Reilly",
                          genre: 'Tech & Coding',
                          format: 'Paperback',
                          description: rec.description,
                        },
                        1
                      );
                      navigate('/checkout');
                    }}
                    className="w-full py-2 px-space-md rounded-full bg-[#D1E4FF] text-[#001D36] hover:bg-[#BFD8FF] border-0 font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    data-path="cart-checkout"
                    type="button"
                  >
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Buy Now</span>
                  </button>
                </div>

                <div className="pt-space-md flex items-center justify-between">
                  <span className="font-title-md text-title-md font-bold text-primary">
                    ${rec.price.toFixed(2)}
                  </span>
                  <button
                    className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:bg-secondary-fixed transition-colors cursor-pointer"
                    title="Quick Add"
                    type="button"
                    onClick={() =>
                      addToCart(
                        {
                          id: rec.id,
                          title: rec.title,
                          author: rec.author,
                          price: rec.price,
                          coverImage: rec.coverImage,
                          rating: 4.8,
                          reviewCount: 120,
                          inStock: true,
                          stockCount: 15,
                          publisher: "O'Reilly",
                          genre: 'Tech & Coding',
                          format: 'Paperback',
                          description: rec.description,
                        },
                        1
                      )
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

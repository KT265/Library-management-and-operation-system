import React, { useState } from 'react';

export const SalesTrajectoryChart: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'copies'>('revenue');

  return (
    <div
      id="dashboard-sales-trajectory"
      data-testid="admin-dashboard-chart-section"
      className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30"
    >
      {/* Header Row & Segmented Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
        <div>
          <h2
            id="chart-section-title"
            data-testid="admin-dashboard-chart-title"
            className="font-title-lg text-title-lg font-bold text-primary"
          >
            Biểu đồ Tăng trưởng &amp; Xu hướng Doanh số
          </h2>
          <p
            id="chart-section-subtitle"
            data-testid="admin-dashboard-chart-subtitle"
            className="font-body-sm text-body-sm text-secondary mt-0.5"
          >
            Theo dõi diễn biến doanh thu thực thu và khối lượng phát hành theo 10 tháng gần nhất
          </p>
        </div>
        <div
          id="chart-metric-toggle"
          data-testid="admin-dashboard-chart-toggle-group"
          className="inline-flex p-1 bg-surface-container rounded-full text-label-sm font-label-sm self-start border border-outline-variant/20"
        >
          <button
            type="button"
            id="btn-chart-metric-revenue"
            data-testid="admin-dashboard-chart-btn-revenue"
            onClick={() => setActiveMetric('revenue')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
              activeMetric === 'revenue'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Doanh thu (₫)
          </button>
          <button
            type="button"
            id="btn-chart-metric-copies"
            data-testid="admin-dashboard-chart-btn-copies"
            onClick={() => setActiveMetric('copies')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
              activeMetric === 'copies'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Số bản đã bán
          </button>
        </div>
      </div>

      {/* Custom SVG Chart Container */}
      <div
        id="sales-chart-wrapper"
        data-testid="admin-dashboard-chart-wrapper"
        className="w-full relative pt-4"
      >
        <div className="absolute left-8 right-2 top-20 border-b border-dashed border-tertiary-fixed-dim/70 flex justify-end pointer-events-none"></div>

        {/* Inline SVG Visualization */}
        <svg
          id="salesTrajectorySvg"
          data-testid="admin-dashboard-chart-svg"
          className="w-full h-56 text-primary"
          preserveAspectRatio="none"
          viewBox="0 0 1100 240"
        >
          {/* Horizontal Reference Lines */}
          <line stroke="#eceef1" strokeWidth="1" x1="40" x2="1060" y1="30" y2="30" />
          <line stroke="#eceef1" strokeWidth="1" x1="40" x2="1060" y1="80" y2="80" />
          <line stroke="#eceef1" strokeWidth="1" x1="40" x2="1060" y1="130" y2="130" />
          <line stroke="#eceef1" strokeWidth="1" x1="40" x2="1060" y1="180" y2="180" />

          {/* Y-Axis Value Labels in VND / Units */}
          <text fill="#74777f" fontSize="11" textAnchor="end" x="34" y="34">
            {activeMetric === 'revenue' ? '1.2 tỷ ₫' : '2.500'}
          </text>
          <text fill="#74777f" fontSize="11" textAnchor="end" x="34" y="84">
            {activeMetric === 'revenue' ? '1.0 tỷ ₫' : '2.000'}
          </text>
          <text fill="#74777f" fontSize="11" textAnchor="end" x="34" y="134">
            {activeMetric === 'revenue' ? '600 tr ₫' : '1.200'}
          </text>
          <text fill="#74777f" fontSize="11" textAnchor="end" x="34" y="184">
            {activeMetric === 'revenue' ? '250 tr ₫' : '500'}
          </text>

          {/* 10 Monthly Histogram Bars */}
          {activeMetric === 'revenue' ? (
            <>
              <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="65" rx="6" width="50" x="75" y="125" />
              <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="80" rx="6" width="50" x="175" y="110" />
              <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="95" rx="6" width="50" x="275" y="95" />
              <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="60" rx="6" width="50" x="375" y="130" />
              <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="105" rx="6" width="50" x="475" y="85" />
              <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="120" rx="6" width="50" x="575" y="70" />
              <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="100" rx="6" width="50" x="675" y="90" />
              <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#1a365d" height="130" rx="6" width="50" x="775" y="60" />
              <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#1a365d" height="140" rx="6" width="50" x="875" y="50" />
              <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#002045" height="152" rx="6" width="50" x="975" y="38" />
              {/* Spline Curve Overlay & Peak Dot */}
              <path
                d="M 100 125 C 200 110, 300 95, 400 130 C 500 85, 600 70, 700 90 C 800 60, 900 50, 1000 38"
                fill="none"
                stroke="#f57c51"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <circle cx="1000" cy="38" fill="#661c00" r="5" />
            </>
          ) : (
            <>
              <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="50" rx="6" width="50" x="75" y="140" />
              <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="70" rx="6" width="50" x="175" y="120" />
              <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="85" rx="6" width="50" x="275" y="105" />
              <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="45" rx="6" width="50" x="375" y="145" />
              <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="100" rx="6" width="50" x="475" y="90" />
              <rect className="hover:fill-primary transition-all cursor-pointer" fill="#d0e1fe" height="110" rx="6" width="50" x="575" y="80" />
              <rect className="hover:fill-secondary-container transition-all cursor-pointer" fill="#eceef1" height="90" rx="6" width="50" x="675" y="100" />
              <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#1a365d" height="120" rx="6" width="50" x="775" y="70" />
              <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#1a365d" height="135" rx="6" width="50" x="875" y="55" />
              <rect className="hover:opacity-90 transition-all cursor-pointer" fill="#002045" height="148" rx="6" width="50" x="975" y="42" />
              {/* Spline Curve Overlay & Peak Dot */}
              <path
                d="M 100 140 C 200 120, 300 105, 400 145 C 500 90, 600 80, 700 100 C 800 70, 900 55, 1000 42"
                fill="none"
                stroke="#f57c51"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <circle cx="1000" cy="42" fill="#661c00" r="5" />
            </>
          )}
        </svg>

        {/* X-Axis Month Labels */}
        <div
          id="sales-chart-xaxis"
          data-testid="admin-dashboard-chart-xaxis"
          className="grid grid-cols-10 pl-10 pr-2 pt-2 text-center text-outline font-label-sm text-label-sm"
        >
          <span>Tháng 1</span>
          <span>Tháng 2</span>
          <span>Tháng 3</span>
          <span>Tháng 4</span>
          <span>Tháng 5</span>
          <span>Tháng 6</span>
          <span>Tháng 7</span>
          <span>Tháng 8</span>
          <span>Tháng 9</span>
          <span className="text-primary font-bold">Tháng 10</span>
        </div>
      </div>
    </div>
  );
};

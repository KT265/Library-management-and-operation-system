import React, { useState } from 'react';

export const ReadingPreferencesCard: React.FC = () => {
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([
    'Văn học tinh hoa',
    'Kỹ thuật phần mềm',
    'Khoa học dữ liệu',
    'Lịch sử & Triết học',
  ]);

  const [preferredFormat, setPreferredFormat] = useState<string>('Hardcover');
  const [emailNotification, setEmailNotification] = useState<boolean>(true);
  const [orderNotification, setOrderNotification] = useState<boolean>(true);

  const availableGenres = [
    'Văn học tinh hoa',
    'Kỹ thuật phần mềm',
    'Khoa học dữ liệu',
    'Lịch sử & Triết học',
    'Thiết kế & Nghệ thuật',
    'Kinh tế & Quản trị',
    'Tâm lý & Phát triển bản thân',
  ];

  const toggleGenre = (genre: string) => {
    setFavoriteGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div
      id="reading-preferences-card"
      data-testid="user-profile-preferences"
      className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-space-md sm:p-space-lg shadow-sm mb-space-lg"
    >
      <div className="flex items-center gap-space-xs text-primary mb-space-md">
        <span className="material-symbols-outlined text-[20px]">tune</span>
        <h3 className="font-title-md text-title-md font-bold text-on-surface">
          Sở thích đọc sách &amp; Cài đặt thông báo
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Favorite Genres Chips */}
        <div>
          <span className="font-label-md text-label-md font-bold text-on-surface block mb-space-xs">
            Chủ đề &amp; Thể loại yêu thích
          </span>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => {
              const isSelected = favoriteGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  data-testid={'user-profile-preferences-chip-' + genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Format & Notification Settings */}
        <div className="flex flex-col space-y-space-md">
          {/* Format selection */}
          <div>
            <span className="font-label-md text-label-md font-bold text-on-surface block mb-space-xs">
              Định dạng ấn phẩm ưu tiên
            </span>
            <div className="flex items-center gap-3">
              {[
                { id: 'Hardcover', label: 'Bìa cứng cao cấp' },
                { id: 'Paperback', label: 'Bìa mềm tiện lợi' },
                { id: 'E-Book', label: 'Sách điện tử (ePub)' },
              ].map((fmt) => (
                <label key={fmt.id} className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="preferredFormat"
                    checked={preferredFormat === fmt.id}
                    onChange={() => setPreferredFormat(fmt.id)}
                    className="text-primary accent-primary"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    {fmt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex flex-col space-y-2 pt-1 border-t border-outline-variant/20">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Nhận bản tin sách mới &amp; đặc quyền thành viên qua Email
              </span>
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={(e) => setEmailNotification(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Thông báo tiến độ giao hàng &amp; hành trình bưu phẩm
              </span>
              <input
                type="checkbox"
                checked={orderNotification}
                onChange={(e) => setOrderNotification(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPreferencesCard;

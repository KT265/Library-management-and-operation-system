import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  AdminVoucher,
  VoucherFilterOptions,
} from '../components/admin-vouchers/types';
import { VouchersHeader } from '../components/admin-vouchers/VouchersHeader';
import { VoucherKpisBento } from '../components/admin-vouchers/VoucherKpisBento';
import { VoucherToolbar } from '../components/admin-vouchers/VoucherToolbar';
import { VouchersTable } from '../components/admin-vouchers/VouchersTable';
import { CreateVoucherModal } from '../components/admin-vouchers/CreateVoucherModal';

const DEFAULT_VOUCHERS: AdminVoucher[] = [
  {
    id: 'v-1',
    code: 'BIBLIO10',
    campaign: 'Đặc quyền Hội viên BookVerse Guild',
    description: 'Ưu đãi tích lũy định kỳ quý cho độc giả tinh hoa',
    discountType: 'fixed',
    discountValue: 50000,
    discountLabel: 'Giảm 50.000 ₫',
    conditionNote: 'Đơn hàng tối thiểu từ 300.000 ₫',
    usedCount: 342,
    totalUsageLimit: 500,
    expiryDate: '15 Thg 11, 2026',
    expiryNote: 'Còn 18 ngày hiệu lực',
    status: 'active',
    minSpend: 300000,
  },
  {
    id: 'v-2',
    code: 'AUTUMN20',
    campaign: 'Lễ hội Mùa thu Toàn hệ thống',
    description: 'Khuyến mại theo mùa cho ấn bản sách tiêu chuẩn và bộ sưu tập',
    discountType: 'percent',
    discountValue: 20,
    discountLabel: 'Giảm 20%',
    conditionNote: 'Không giới hạn đơn tối thiểu',
    usedCount: 890,
    totalUsageLimit: 1000,
    expiryDate: '31 Thg 10, 2026',
    expiryNote: 'Còn 3 ngày (Sắp hết hạn)',
    status: 'expiring',
    minSpend: 0,
  },
  {
    id: 'v-3',
    code: 'WELCOME10',
    campaign: 'Chào mừng Độc giả Mới',
    description: 'Mã ưu đãi tự động kích hoạt cho độc giả tạo tài khoản lần đầu',
    discountType: 'fixed',
    discountValue: 50000,
    discountLabel: 'Giảm 50.000 ₫',
    conditionNote: 'Đơn hàng tối thiểu từ 250.000 ₫',
    usedCount: 120,
    totalUsageLimit: 200,
    expiryDate: '31 Thg 12, 2026',
    expiryNote: 'Còn 64 ngày hiệu lực',
    status: 'active',
    minSpend: 250000,
  },
  {
    id: 'v-4',
    code: 'FREESHIP',
    campaign: 'Miễn phí Giao hàng Tiêu chuẩn',
    description: 'Hỗ trợ cước bưu chính hỏa tốc và tiêu chuẩn toàn quốc',
    discountType: 'shipping',
    discountValue: 30000,
    discountLabel: 'Miễn phí vận chuyển (Freeship)',
    conditionNote: 'Đơn hàng tối thiểu từ 200.000 ₫',
    usedCount: 620,
    totalUsageLimit: 750,
    expiryDate: '28 Thg 11, 2026',
    expiryNote: 'Còn 31 ngày hiệu lực',
    status: 'active',
    minSpend: 200000,
  },
  {
    id: 'v-5',
    code: 'BOOKWORM15',
    campaign: 'Câu lạc bộ Độc giả Hàng tháng',
    description: 'Ưu đãi chọn lọc tác phẩm văn học kinh điển và hiện đại',
    discountType: 'percent',
    discountValue: 15,
    discountLabel: 'Giảm 15%',
    conditionNote: 'Đơn hàng tối thiểu từ 200.000 ₫',
    usedCount: 295,
    totalUsageLimit: 300,
    expiryDate: '02 Thg 11, 2026',
    expiryNote: 'Còn 5 ngày (Gần hết lượt dùng)',
    status: 'expiring',
    minSpend: 200000,
  },
  {
    id: 'v-6',
    code: 'SUMMERREADS',
    campaign: 'Đại hội Sách Hè BookVerse',
    description: 'Danh mục ấn phẩm du lịch và giải trí mùa hạ',
    discountType: 'fixed',
    discountValue: 70000,
    discountLabel: 'Giảm 70.000 ₫',
    conditionNote: 'Đơn hàng tối thiểu từ 350.000 ₫',
    usedCount: 500,
    totalUsageLimit: 500,
    expiryDate: '30 Thg 09, 2026',
    expiryNote: 'Đã kết thúc chương trình 28 ngày trước',
    status: 'expired',
    minSpend: 350000,
  },
];

export const AdminVouchers: React.FC = () => {
  const showToast = useStore((state) => state.showToast);

  const [vouchers, setVouchers] = useState<AdminVoucher[]>(DEFAULT_VOUCHERS);
  const [filterOptions, setFilterOptions] = useState<VoucherFilterOptions>({
    searchTerm: '',
    statusFilter: 'all',
    typeFilter: 'all',
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingVoucher, setEditingVoucher] = useState<AdminVoucher | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filtered list
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      // 1. Search term
      if (filterOptions.searchTerm.trim()) {
        const q = filterOptions.searchTerm.toLowerCase().trim();
        const matchesCode = v.code.toLowerCase().includes(q);
        const matchesCampaign = v.campaign.toLowerCase().includes(q);
        const matchesDesc = v.description.toLowerCase().includes(q);
        if (!matchesCode && !matchesCampaign && !matchesDesc) return false;
      }

      // 2. Status filter
      if (filterOptions.statusFilter !== 'all' && v.status !== filterOptions.statusFilter) {
        return false;
      }

      // 3. Type filter
      if (filterOptions.typeFilter !== 'all' && v.discountType !== filterOptions.typeFilter) {
        return false;
      }

      return true;
    });
  }, [vouchers, filterOptions]);

  // Handlers
  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast?.(`Đã sao chép mã voucher “${code}” vào clipboard.`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  const handleEditVoucher = (voucher: AdminVoucher) => {
    setModalMode('edit');
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleDuplicateVoucher = (voucher: AdminVoucher) => {
    const duplicated: AdminVoucher = {
      ...voucher,
      id: `v-${Date.now()}`,
      code: `${voucher.code}_COPY`,
      campaign: `${voucher.campaign} (Bản sao)`,
      usedCount: 0,
      status: 'active',
    };
    setVouchers((prev) => [duplicated, ...prev]);
    showToast?.(`Đã nhân bản quy tắc voucher “${voucher.code}” thành công.`);
  };

  const handleToggleStatus = (voucher: AdminVoucher) => {
    const newStatus = voucher.status === 'active' ? 'expired' : 'active';
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucher.id ? { ...v, status: newStatus } : v))
    );
    showToast?.(`Đã cập nhật trạng thái voucher “${voucher.code}”.`);
  };

  const handleArchiveVoucher = (voucherId: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== voucherId));
    showToast?.('Đã lưu trữ và xóa mã ưu đãi khỏi danh sách hiển thị.');
  };

  const handleSaveVoucher = (savedVoucher: AdminVoucher) => {
    if (modalMode === 'create') {
      setVouchers((prev) => [savedVoucher, ...prev]);
      showToast?.(`Đã phát hành thành công mã voucher “${savedVoucher.code}”.`);
    } else {
      setVouchers((prev) =>
        prev.map((v) => (v.id === savedVoucher.id ? savedVoucher : v))
      );
      showToast?.(`Đã cập nhật quy tắc voucher “${savedVoucher.code}”.`);
    }
  };

  const handleRefresh = () => {
    showToast?.('Đã làm mới dữ liệu voucher và tỷ lệ quy đổi thời gian thực.');
  };

  const activeCount = vouchers.filter((v) => v.status === 'active').length;

  return (
    <div
      id="admin-vouchers-page"
      data-testid="admin-vouchers-page-root"
      className="flex flex-col w-full pb-space-xxl space-y-space-lg"
    >
      {/* 1. Header with Active Count Badge and Create Voucher CTA */}
      <VouchersHeader
        activeCount={activeCount}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* 2. Bento KPI Metric Cards */}
      <VoucherKpisBento />

      {/* 3. Toolbar with Search, Status / Discount Type Dropdowns, Refresh */}
      <VoucherToolbar
        filterOptions={filterOptions}
        onFilterChange={(updates) =>
          setFilterOptions((prev) => ({ ...prev, ...updates }))
        }
        onRefresh={handleRefresh}
        matchCount={filteredVouchers.length}
      />

      {/* 4. 7-Column Vouchers Data Table */}
      <VouchersTable
        vouchers={filteredVouchers}
        copiedCode={copiedCode}
        onCopyCode={handleCopyCode}
        onEdit={handleEditVoucher}
        onDuplicate={handleDuplicateVoucher}
        onToggleStatus={handleToggleStatus}
        onArchive={handleArchiveVoucher}
      />

      {/* 5. Create / Edit Voucher Modal */}
      <CreateVoucherModal
        isOpen={isModalOpen}
        mode={modalMode}
        editingVoucher={editingVoucher}
        onClose={() => setIsModalOpen(false)}
        onSaveVoucher={handleSaveVoucher}
      />
    </div>
  );
};

export default AdminVouchers;

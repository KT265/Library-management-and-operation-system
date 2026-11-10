import React, { useState, useMemo, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, mapFirestoreVoucherToAdminVoucher } from '../services/firebase';
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

export const AdminVouchers: React.FC = () => {
  const showToast = useStore((state) => state.showToast);

  const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filterOptions, setFilterOptions] = useState<VoucherFilterOptions>({
    searchTerm: '',
    statusFilter: 'all',
    typeFilter: 'all',
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingVoucher, setEditingVoucher] = useState<AdminVoucher | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchVouchers = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, 'Vouchers'));
      const fetched = snap.docs.map((d) => mapFirestoreVoucherToAdminVoucher(d.data(), d.id));
      setVouchers(fetched);
    } catch (err: any) {
      console.error('[AdminVouchers] Error querying "Vouchers":', err);
      setError('Không thể tải danh sách mã voucher từ Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

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
    showToast?.(`Đã nhân bản voucher “${voucher.code}” thành công.`);
  };

  const handleDeleteVoucher = (voucherId: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== voucherId));
    showToast?.('Đã xóa mã voucher khỏi hệ thống khuyến mại.');
  };

  const handleToggleStatus = (voucher: AdminVoucher) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === voucher.id
          ? { ...v, status: v.status === 'active' ? 'expired' : 'active' }
          : v
      )
    );
    showToast?.(`Đã thay đổi trạng thái mã “${voucher.code}”.`);
  };

  const handleSaveVoucher = (voucher: AdminVoucher) => {
    if (modalMode === 'create') {
      setVouchers((prev) => [voucher, ...prev]);
      showToast?.(`Đã kích hoạt mã ưu đãi mới “${voucher.code}”.`);
    } else {
      setVouchers((prev) =>
        prev.map((v) => (v.id === voucher.id ? voucher : v))
      );
      showToast?.(`Đã cập nhật mã ưu đãi “${voucher.code}”.`);
    }
    setIsModalOpen(false);
  };

  return (
    <div
      id="admin-vouchers-page"
      data-testid="admin-vouchers-page-root"
      className="flex flex-col w-full pb-space-xxl space-y-space-lg"
    >
      {/* 1. Header with Title & Add Voucher CTA */}
      <VouchersHeader
        activeCount={vouchers.filter((v) => v.status === 'active').length}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* 2. 4-Card Bento Metrics Grid */}
      <VoucherKpisBento />

      {/* 3. Search and Multi-Filter Toolbar */}
      <VoucherToolbar
        filterOptions={filterOptions}
        onFilterChange={(updates) => setFilterOptions((prev) => ({ ...prev, ...updates }))}
        onRefresh={fetchVouchers}
        matchCount={filteredVouchers.length}
      />

      {/* Loading & Error States */}
      {loading ? (
        <div
          id="admin-vouchers-loading"
          data-testid="admin-vouchers-loading-spinner"
          className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30"
        >
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-secondary font-medium text-body-md">Đang đồng bộ danh sách voucher từ Firestore...</p>
        </div>
      ) : error ? (
        <div
          id="admin-vouchers-error"
          data-testid="admin-vouchers-error-state"
          className="flex flex-col items-center justify-center p-8 bg-error/5 border border-error/20 rounded-2xl text-center"
        >
          <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
          <p className="text-error font-medium mb-4">{error}</p>
          <button
            onClick={fetchVouchers}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : (
        /* 4. 7-Column Vouchers Data Table */
        <VouchersTable
          vouchers={filteredVouchers}
          onCopyCode={handleCopyCode}
          copiedCode={copiedCode}
          onEdit={handleEditVoucher}
          onDuplicate={handleDuplicateVoucher}
          onToggleStatus={handleToggleStatus}
          onArchive={handleDeleteVoucher}
        />
      )}

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

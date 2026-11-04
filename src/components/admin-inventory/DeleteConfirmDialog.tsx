import React from 'react';
import { InventoryBook } from './types';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  book: InventoryBook | null;
  onClose: () => void;
  onConfirmDelete: (bookId: string) => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  book,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !book) return null;

  return (
    <div
      id="delete-confirm-dialog-backdrop"
      data-testid="admin-inventory-dialog-delete-backdrop"
      className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div
        id="delete-confirm-dialog"
        data-testid="admin-inventory-dialog-delete"
        className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-md w-full shadow-2xl border border-surface-container animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center gap-space-sm mb-space-md text-error">
          <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div>
            <h3 className="font-title-lg font-bold text-on-surface">
              Xác nhận xóa ấn phẩm?
            </h3>
            <p className="font-body-sm text-secondary">
              Mã sách: <span className="font-mono font-semibold">{book.id}</span>
            </p>
          </div>
        </div>

        <p className="font-body-md text-body-md text-on-surface mb-space-lg">
          Bạn có chắc chắn muốn xóa ấn phẩm{' '}
          <strong className="text-primary font-bold">"{book.title}"</strong> ({book.isbn}) khỏi
          danh mục kho sách? Thao tác này không thể hoàn tác.
        </p>

        <div className="flex items-center justify-end gap-space-sm">
          <button
            type="button"
            id="btn-cancel-delete"
            data-testid="admin-inventory-dialog-delete-btn-cancel"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-secondary hover:bg-surface-container font-label-md text-label-md cursor-pointer transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            id="btn-confirm-delete"
            data-testid="admin-inventory-dialog-delete-btn-confirm"
            onClick={() => {
              onConfirmDelete(book.id);
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-error text-on-error hover:bg-error/90 font-label-md text-label-md font-bold shadow-sm transition-colors cursor-pointer"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};

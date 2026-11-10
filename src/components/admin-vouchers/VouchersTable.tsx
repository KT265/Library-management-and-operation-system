import React from 'react';
import { AdminVoucher } from './types';
import { VoucherTableRow } from './VoucherTableRow';

interface VouchersTableProps {
  vouchers: AdminVoucher[];
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
  onEdit: (voucher: AdminVoucher) => void;
  onDuplicate: (voucher: AdminVoucher) => void;
  onToggleStatus: (voucher: AdminVoucher) => void;
  onArchive: (voucherId: string) => void;
}

export const VouchersTable: React.FC<VouchersTableProps> = ({
  vouchers,
  copiedCode,
  onCopyCode,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onArchive,
}) => {
  return (
    <div
      id="vouchers-table-wrapper"
      data-testid="admin-vouchers-table-wrapper"
      className="w-full overflow-x-auto rounded-3xl shadow-sm bg-surface-container-lowest border border-outline-variant/30 overflow-hidden"
    >
      <table
        id="vouchersTable"
        data-testid="admin-vouchers-table"
        className="w-full text-left border-collapse min-w-[960px]"
      >
        <thead>
          <tr className="bg-surface-container-low font-label-md text-label-md uppercase tracking-wider text-secondary select-none border-b border-surface-container-high">
            <th scope="col" id="col-voucher-code" className="py-3.5 px-4 font-semibold text-primary">
              Mã voucher (Voucher Code)
            </th>
            <th scope="col" id="col-campaign-desc" className="py-3.5 px-4 font-semibold">
              Chiến dịch &amp; Mô tả (Campaign &amp; Description)
            </th>
            <th scope="col" id="col-discount-val" className="py-3.5 px-4 font-semibold">
              Mức giảm (Discount Value)
            </th>
            <th scope="col" id="col-usage-limit" className="py-3.5 px-4 font-semibold min-w-[190px]">
              Đã dùng / Giới hạn (Usage / Limit)
            </th>
            <th scope="col" id="col-expiry-date" className="py-3.5 px-4 font-semibold">
              Hạn dùng (Expiry Date)
            </th>
            <th scope="col" id="col-status" className="py-3.5 px-4 font-semibold text-center">
              Trạng thái (Status)
            </th>
            <th scope="col" id="col-actions" className="py-3.5 px-4 font-semibold text-right">
              Thao tác (Actions)
            </th>
          </tr>
        </thead>
        <tbody
          id="voucher-table-body"
          data-testid="admin-vouchers-table-body"
          className="font-body-md text-body-md divide-y divide-surface-container"
        >
          {vouchers.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                id="vouchers-empty-row"
                data-testid="admin-vouchers-table-empty"
                className="py-12 text-center text-secondary font-body-md"
              >
                <span className="material-symbols-outlined text-[36px] text-outline block mb-2">
                  confirmation_number
                </span>
                Không tìm thấy mã ưu đãi nào khớp với bộ lọc hiện tại.
              </td>
            </tr>
          ) : (
            vouchers.map((voucher) => (
              <VoucherTableRow
                key={voucher.id}
                voucher={voucher}
                copiedCode={copiedCode}
                onCopyCode={onCopyCode}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onToggleStatus={onToggleStatus}
                onArchive={onArchive}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

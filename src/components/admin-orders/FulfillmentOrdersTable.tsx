import React from 'react';
import { FulfillmentOrder, OrderFulfillmentCycle } from './types';
import { FulfillmentOrderRow } from './FulfillmentOrderRow';

interface FulfillmentOrdersTableProps {
  orders: FulfillmentOrder[];
  totalFulfillmentsCount: number;
  currentPage: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onOpenConsole: (order: FulfillmentOrder) => void;
  onUpdateCycle: (orderId: string, newCycle: OrderFulfillmentCycle) => void;
  onResolveOverdue: (order: FulfillmentOrder) => void;
}

export const FulfillmentOrdersTable: React.FC<FulfillmentOrdersTableProps> = ({
  orders,
  totalFulfillmentsCount,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onOpenConsole,
  onUpdateCycle,
  onResolveOverdue,
}) => {
  const totalPages = Math.ceil(orders.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + rowsPerPage);

  const startCount = orders.length === 0 ? 0 : startIndex + 1;
  const endCount = Math.min(startIndex + rowsPerPage, orders.length);

  return (
    <div
      id="orders-table-wrapper"
      data-testid="admin-orders-table-wrapper"
      className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table
          id="adminOrdersTable"
          data-testid="admin-orders-table"
          className="w-full text-left border-collapse"
        >
          <thead>
            <tr className="border-b border-surface-container-high bg-surface-container-low text-secondary font-label-md text-label-md uppercase tracking-wider">
              <th scope="col" id="col-order-id" className="py-3.5 px-4 font-semibold">
                Mã đơn hàng
              </th>
              <th scope="col" id="col-patron" className="py-3.5 px-4 font-semibold min-w-[200px]">
                Độc giả / Người mua
              </th>
              <th scope="col" id="col-books" className="py-3.5 px-4 font-semibold min-w-[220px]">
                Danh mục ấn phẩm
              </th>
              <th scope="col" id="col-due-date" className="py-3.5 px-4 font-semibold">
                Hạn trả / Trạng thái
              </th>
              <th scope="col" id="col-payment" className="py-3.5 px-4 font-semibold">
                Cổng thanh toán
              </th>
              <th scope="col" id="col-cycle" className="py-3.5 px-4 font-semibold text-center">
                Tiến độ đơn hàng
              </th>
              <th scope="col" id="col-actions" className="py-3.5 px-4 font-semibold text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody id="orders-table-body" className="divide-y divide-surface-container text-on-surface font-body-sm text-body-sm">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  id="orders-empty-row"
                  data-testid="admin-orders-table-empty"
                  className="py-12 text-center text-secondary font-body-md"
                >
                  <span className="material-symbols-outlined text-[36px] text-outline block mb-2">
                    inbox
                  </span>
                  Không có đơn hàng nào khớp với điều kiện lọc và tìm kiếm.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <FulfillmentOrderRow
                  key={order.id}
                  order={order}
                  onOpenConsole={onOpenConsole}
                  onUpdateCycle={onUpdateCycle}
                  onResolveOverdue={onResolveOverdue}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Count Summary Bar */}
      <div
        id="orders-pagination-bar"
        data-testid="admin-orders-pagination-bar"
        className="p-space-md border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-md text-xs text-secondary font-body-sm"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span id="orders-showing-indicator" data-testid="admin-orders-showing-indicator">
            Hiển thị <span className="font-semibold text-primary num-tabular">{startCount}</span> -{' '}
            <span className="font-semibold text-primary num-tabular">{endCount}</span> trên{' '}
            <span className="font-semibold text-primary num-tabular">{totalFulfillmentsCount}</span> đơn hàng
          </span>

          <div className="inline-flex items-center gap-1.5">
            <span>Số dòng mỗi trang:</span>
            <select
              id="ordersRowsPerPageSelect"
              data-testid="admin-orders-select-rows-per-page"
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-on-surface cursor-pointer focus:outline-none"
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            id="btn-orders-prev"
            data-testid="admin-orders-btn-prev"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`px-3 py-1 rounded-full border text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
              currentPage <= 1
                ? 'border-outline-variant/20 text-outline/50 cursor-not-allowed'
                : 'border-outline-variant/40 text-primary hover:bg-surface-container cursor-pointer'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span>Trước</span>
          </button>

          <span className="px-2 font-semibold text-primary num-tabular">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            id="btn-orders-next"
            data-testid="admin-orders-btn-next"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`px-3 py-1 rounded-full border text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
              currentPage >= totalPages
                ? 'border-outline-variant/20 text-outline/50 cursor-not-allowed'
                : 'border-outline-variant/40 text-primary hover:bg-surface-container cursor-pointer'
            }`}
          >
            <span>Sau</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

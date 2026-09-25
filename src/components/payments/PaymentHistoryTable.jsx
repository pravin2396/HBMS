import React, { useState } from 'react';
import {
  FileText,
  Eye,
  Download,
  Edit3,
  CreditCard,
  Banknote,
  Landmark,
  QrCode,
  Coins,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { usePayment } from '../../context/usePayment';

const getMethodIcon = (methodStr = '') => {
  const m = methodStr.toLowerCase();
  if (m.includes('cash')) return Banknote;
  if (m.includes('bank') || m.includes('wire') || m.includes('swift')) return Landmark;
  if (m.includes('upi') || m.includes('qr')) return QrCode;
  if (m.includes('crypto')) return Coins;
  return CreditCard;
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Paid':
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400',
        icon: CheckCircle2,
        label: 'Paid'
      };
    case 'Partially Paid':
      return {
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-400',
        icon: Clock,
        label: 'Partially Paid'
      };
    case 'Pending':
      return {
        bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        dot: 'bg-yellow-400',
        icon: Clock,
        label: 'Pending'
      };
    case 'Refunded':
      return {
        bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        dot: 'bg-purple-400',
        icon: RotateCcw,
        label: 'Refunded'
      };
    default:
      return {
        bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        dot: 'bg-slate-400',
        icon: AlertCircle,
        label: status || 'Unknown'
      };
  }
};

const PaymentHistoryTable = () => {
  const {
    filteredPayments,
    openInvoiceModal,
    openStatusModal,
    handleDownloadInvoice,
    resetFilters
  } = usePayment();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Table Header / Title */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-base font-bold text-white tracking-wide">
              Payment & Transaction History
            </h3>
            <p className="text-[11px] text-slate-400">
              Audit trail of guest billing folios, direct settlements & refunds
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">
          Showing {paginatedPayments.length} of {filteredPayments.length}
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <th className="py-3 px-4">Invoice / Txn ID</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Guest Details</th>
              <th className="py-3 px-4">Suite / Room</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((p) => {
                const MethodIcon = getMethodIcon(p.paymentMethod);
                const statusInfo = getStatusBadge(p.status);
                const StatusIcon = statusInfo.icon;
                const dateObj = p.transactionDate ? new Date(p.transactionDate) : new Date();

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Invoice ID / Txn */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => openInvoiceModal(p)}
                        className="font-mono text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline block text-left cursor-pointer"
                      >
                        {p.invoiceNumber || p.id}
                      </button>
                      <span className="font-mono text-[10px] text-slate-500 block">
                        {p.transactionId}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <div className="text-xs font-medium text-slate-200">
                        {dateObj.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {dateObj.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Guest Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            p.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${p.guestName || 'G'}`
                          }
                          alt={p.guestName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div className="truncate max-w-[140px] sm:max-w-[180px]">
                          <span className="font-medium text-white block truncate">
                            {p.guestName}
                          </span>
                          <span className="text-[10px] text-amber-400/90 font-medium block truncate">
                            {p.vipStatus || 'Standard Guest'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Room & Suite */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-200 text-xs block">
                        Suite {p.roomNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[130px]">
                        {p.suiteType}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-serif-luxury font-bold text-white text-sm block">
                        ${Number(p.amount).toLocaleString()}
                      </span>
                      {p.status === 'Partially Paid' && (
                        <span className="text-[10px] text-blue-400 block">
                          Paid: ${Number(p.paidAmount).toLocaleString()}
                        </span>
                      )}
                      {p.status === 'Pending' && (
                        <span className="text-[10px] text-yellow-400 block">
                          Due: ${Number(p.amount).toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <MethodIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[130px]">
                          {p.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}
                        />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Invoice */}
                        <button
                          type="button"
                          onClick={() => openInvoiceModal(p)}
                          title="View Official Invoice"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Download Invoice UI (Dummy) */}
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(p)}
                          title="Download Invoice PDF (Dummy)"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/40 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Update Payment Status */}
                        <button
                          type="button"
                          onClick={() => openStatusModal(p)}
                          title="Update Payment Status"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-400 border border-slate-700 hover:border-blue-500/40 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 px-4 text-center">
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200">
                      No Payment Records Found
                    </h4>
                    <p className="text-xs text-slate-400">
                      No transactions matched your current search filters or date range.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
          <div>
            Page <span className="text-white font-bold">{currentPage}</span> of{' '}
            <span className="text-white font-bold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryTable;

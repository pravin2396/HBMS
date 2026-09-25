import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Building,
  CreditCard,
  User,
  Calendar,
  Share2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { usePayment } from '../../context/usePayment';

const InvoiceModal = () => {
  const {
    selectedInvoice,
    isInvoiceModalOpen,
    closeInvoiceModal,
    handleDownloadInvoice,
    isDownloading
  } = usePayment();

  const printAreaRef = useRef(null);

  if (!isInvoiceModalOpen || !selectedInvoice) {
    return null;
  }

  const p = selectedInvoice;
  const issueDate = p.transactionDate
    ? new Date(p.transactionDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-US');

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Invoice link copied to clipboard!');
  };

  const isPaid = p.status === 'Paid';
  const isPending = p.status === 'Pending';
  const isPartial = p.status === 'Partially Paid';
  const isRefunded = p.status === 'Refunded';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Action Toolbar Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {p.invoiceNumber || p.id}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Official Hotel Folio & Tax Invoice
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Invoice UI (Dummy) */}
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => handleDownloadInvoice(p)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/10 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download Invoice (PDF)'}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Share / Copy Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy invoice link"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={closeInvoiceModal}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Folio Content */}
        <div
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-slate-950 text-slate-100 print:bg-white print:text-black print:p-0"
        >
          {/* Folio Brand Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800 print:border-gray-300">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
                <Hotel className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-serif-luxury text-2xl font-bold tracking-wider text-amber-400 block leading-tight">
                  Paradise
                </span>
                <span className="text-[10px] tracking-[0.28em] text-slate-400 font-bold uppercase block">
                  Hotel & Luxury Resort • 5-Star
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  700 Oceanfront Blvd, Palm Haven Island, CA 90210
                </span>
              </div>
            </div>

            {/* Invoice Meta & Status Stamp */}
            <div className="text-left sm:text-right space-y-1">
              <div className="font-serif-luxury text-xl font-bold text-white tracking-wide uppercase">
                Guest Folio / Invoice
              </div>
              <div className="font-mono text-xs font-semibold text-amber-400">
                {p.invoiceNumber}
              </div>
              <div className="text-xs text-slate-400">
                Date: <span className="text-slate-200">{issueDate}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Txn Ref: <span className="text-slate-300">{p.transactionId}</span>
              </div>

              {/* Status Stamp / Seal */}
              <div className="pt-2">
                {isPaid && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-widest">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PAID IN FULL
                  </span>
                )}
                {isPending && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    PAYMENT DUE
                  </span>
                )}
                {isPartial && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    PARTIALLY PAID
                  </span>
                )}
                {isRefunded && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40 uppercase tracking-widest">
                    <RotateCcw className="w-3.5 h-3.5" />
                    REFUNDED
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Billed To & Stay Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            {/* Guest Info */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <User className="w-3 h-3 text-amber-400" />
                Billed To (Guest Information)
              </span>
              <h4 className="font-serif-luxury text-base font-bold text-white">
                {p.guestName}
              </h4>
              <p className="text-xs text-amber-400/90 font-medium">
                VIP Tier: {p.vipStatus || 'Standard Luxury Guest'}
              </p>
              <p className="text-xs text-slate-400">{p.guestEmail}</p>
              <p className="text-xs text-slate-400">{p.guestPhone}</p>
            </div>

            {/* Stay Info */}
            <div className="space-y-1.5 md:border-l md:border-slate-800 md:pl-6">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-amber-400" />
                Stay & Suite Details
              </span>
              <h4 className="font-serif-luxury text-base font-bold text-white">
                Suite {p.roomNumber} • {p.suiteType}
              </h4>
              <p className="text-xs text-slate-300">
                Duration: <span className="font-semibold text-white">{p.nights} Nights</span>
              </p>
              <p className="text-xs text-slate-400">
                Check-In: <span className="text-slate-200">{p.checkIn}</span> • Check-Out: <span className="text-slate-200">{p.checkOut}</span>
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Booking Reference: <span className="text-amber-400">{p.bookingId}</span>
              </p>
            </div>
          </div>

          {/* Itemized Billing Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Itemized Folio Breakdown
            </h4>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-4">Item / Description</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {p.items && p.items.length > 0 ? (
                    p.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-medium text-slate-200">
                          {item.description}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-xs">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px]">
                            {item.category || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-100">
                          ${Number(item.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-200">
                        {p.suiteType} Accommodation ({p.nights} Nights)
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs">Room Tariff</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-100">
                        ${Number(p.subtotal).toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Tax Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4 border-t border-slate-800">
            {/* Payment Method Details */}
            <div className="space-y-2 max-w-sm">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Payment Method & Audit
              </span>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>{p.paymentMethod}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Authorized Agent: <span className="text-slate-300">{p.receptionAgent || 'Duty Manager'}</span>
                </div>
                {p.notes && (
                  <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-800/60">
                    "{p.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200 font-medium">
                  ${Number(p.subtotal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Luxury Hospitality Tax (12%)</span>
                <span className="font-mono text-slate-200">
                  ${Number(p.taxAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Resort Service Charge (5%)</span>
                <span className="font-mono text-slate-200">
                  ${Number(p.serviceChargeAmount).toLocaleString()}
                </span>
              </div>
              {p.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Privilege Discount</span>
                  <span className="font-mono">
                    -${Number(p.discountAmount).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                <span>Total Amount</span>
                <span className="font-mono font-serif-luxury text-base text-amber-400">
                  ${Number(p.amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-300 pt-1">
                <span>Amount Paid</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  ${Number(p.paidAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Balance Due</span>
                <span className={`font-mono font-bold ${p.balanceDue > 0 ? 'text-yellow-400' : 'text-slate-400'}`}>
                  ${Number(p.balanceDue).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Terms & Stamp */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
            <div>
              <p>Paradise Hotel & Luxury Resort • GSTIN: US-TAX-88392019</p>
              <p>All room charges, tariffs, and luxury levies are subject to resort policies.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="border border-dashed border-amber-500/40 rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
                  AUTHENTICATED FOLIO
                </span>
                <span className="text-[9px] text-slate-400 block">
                  Paradise Resort Treasury
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;

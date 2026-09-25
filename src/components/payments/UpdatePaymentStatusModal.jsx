import React, { useState, useEffect } from 'react';
import {
  X,
  Edit3,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { usePayment } from '../../context/usePayment';

const UpdatePaymentStatusModal = () => {
  const {
    isStatusModalOpen,
    closeStatusModal,
    paymentToUpdate,
    handleUpdateStatus,
    isLoading
  } = usePayment();

  const [status, setStatus] = useState('Paid');
  const [partialAmount, setPartialAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Visa)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (paymentToUpdate) {
      setStatus(paymentToUpdate.status || 'Paid');
      setPartialAmount(paymentToUpdate.paidAmount || Math.round(paymentToUpdate.amount / 2));
      setPaymentMethod(paymentToUpdate.paymentMethod || 'Credit Card (Visa)');
      setNotes(paymentToUpdate.notes || '');
    }
  }, [paymentToUpdate]);

  if (!isStatusModalOpen || !paymentToUpdate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateStatus(paymentToUpdate.id, status, {
      paidAmount: status === 'Partially Paid' ? Number(partialAmount) : undefined,
      paymentMethod,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Edit3 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-white tracking-wide">
                Update Payment Status
              </h3>
              <p className="font-mono text-[11px] text-amber-400">
                {paymentToUpdate.invoiceNumber} • {paymentToUpdate.guestName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeStatusModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Quick Info Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Suite Assigned</span>
              <span className="font-semibold text-white">Suite {paymentToUpdate.roomNumber} ({paymentToUpdate.suiteType})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">Total Invoice Amount</span>
              <span className="font-serif-luxury text-base font-bold text-amber-400">
                ${Number(paymentToUpdate.amount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* New Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select New Payment Status *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'Paid', label: 'Paid in Full', icon: CheckCircle2, color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
                { value: 'Partially Paid', label: 'Partially Paid', icon: Clock, color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
                { value: 'Pending', label: 'Pending Due', icon: Clock, color: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' },
                { value: 'Refunded', label: 'Refund Issued', icon: RotateCcw, color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' }
              ].map((opt) => {
                const isSelected = status === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                      isSelected
                        ? `${opt.color} ring-2 ring-amber-500/50`
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Partial Payment Amount Input if Partial */}
          {status === 'Partially Paid' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount Collected So Far ($)
              </label>
              <input
                type="number"
                min="1"
                max={paymentToUpdate.amount}
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Credit Card (Visa)">Credit Card (Visa)</option>
              <option value="Credit Card (Mastercard)">Credit Card (Mastercard)</option>
              <option value="Credit Card (Amex Black)">Credit Card (Amex Black)</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash (Front Desk)">Cash (Front Desk)</option>
              <option value="Bank Wire / Swift">Bank Wire / Swift</option>
              <option value="Instant UPI / QR Code">Instant UPI / QR Code</option>
              <option value="Cryptocurrency">Cryptocurrency</option>
            </select>
          </div>

          {/* Settlement / Audit Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Audit Note / Settlement Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified by Front Desk supervisor. Card receipt archived."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeStatusModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Confirm Status Update'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default UpdatePaymentStatusModal;

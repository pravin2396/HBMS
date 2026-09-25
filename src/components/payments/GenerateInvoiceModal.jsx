import React, { useState } from 'react';
import {
  X,
  FilePlus,
  Plus,
  Trash2,
  Building,
  User,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { usePayment } from '../../context/usePayment';

const GenerateInvoiceModal = () => {
  const {
    isGenerateInvoiceModalOpen,
    closeGenerateInvoiceModal,
    handleCreateInvoice,
    isLoading
  } = usePayment();

  const todayStr = new Date().toISOString().split('T')[0];
  const d3Str = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    vipStatus: 'Standard Guest',
    roomNumber: '101',
    suiteType: 'Deluxe Room',
    checkIn: todayStr,
    checkOut: d3Str,
    nights: 3,
    roomNightlyRate: 350,
    paymentMethod: 'Credit Card (Visa)',
    paymentMethodType: 'Credit Card',
    status: 'Paid',
    receptionAgent: 'Alexander Sterling (Duty Manager)',
    notes: 'Official reservation folio generated at reception.'
  });

  const [extraItems, setExtraItems] = useState([
    { description: 'Fine Dining at Le Paradis', category: 'Dining', amount: 180 },
    { description: 'Airport Luxury Chauffeur Transfer', category: 'Concierge', amount: 120 }
  ]);

  if (!isGenerateInvoiceModalOpen) return null;

  const roomTotal = Number(formData.roomNightlyRate) * Number(formData.nights || 1);
  const extrasTotal = extraItems.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const subtotal = roomTotal + extrasTotal;
  const taxAmount = Math.round(subtotal * 0.12);
  const serviceChargeAmount = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + taxAmount + serviceChargeAmount;

  const handleAddItem = () => {
    setExtraItems([
      ...extraItems,
      { description: 'Luxury Resort Amenity', category: 'General', amount: 100 }
    ]);
  };

  const handleRemoveItem = (index) => {
    setExtraItems(extraItems.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...extraItems];
    updated[index][field] = field === 'amount' ? Number(value) || 0 : value;
    setExtraItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.guestName.trim()) {
      alert('Please enter guest name');
      return;
    }

    const allItems = [
      {
        id: 'item-room',
        description: `${formData.suiteType} (${formData.nights} Nights @ $${formData.roomNightlyRate}/nt)`,
        category: 'Room Tariff',
        amount: roomTotal
      },
      ...extraItems.map((item, idx) => ({
        id: `item-extra-${idx}`,
        ...item
      }))
    ];

    handleCreateInvoice({
      ...formData,
      subtotal,
      taxAmount,
      serviceChargeAmount,
      amount: grandTotal,
      items: allItems
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FilePlus className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-white tracking-wide">
                Generate Guest Invoice (UI)
              </h3>
              <p className="text-[11px] text-slate-400">
                Issue a custom hotel tax folio & payment voucher
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeGenerateInvoiceModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Guest Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              1. Guest Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Guest Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Vivienne Montgomery"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  VIP Classification
                </label>
                <select
                  value={formData.vipStatus}
                  onChange={(e) => setFormData({ ...formData, vipStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Standard Guest">Standard Guest</option>
                  <option value="Gold VIP">Gold VIP</option>
                  <option value="Platinum VIP">Platinum VIP</option>
                  <option value="Diamond Elite">Diamond Elite</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="guest@luxury.com"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Stay & Room Details */}
          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              2. Stay & Room Accommodation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Room #
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Suite Type
                </label>
                <select
                  value={formData.suiteType}
                  onChange={(e) => setFormData({ ...formData, suiteType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Deluxe Room">Deluxe Room ($250)</option>
                  <option value="Executive Diplomat Suite">Executive Diplomat Suite ($500)</option>
                  <option value="Royal Oceanfront Villa">Royal Oceanfront Villa ($750)</option>
                  <option value="Presidential Penthouse">Presidential Penthouse ($650)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Nights
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.nights}
                  onChange={(e) => setFormData({ ...formData, nights: Number(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Nightly Rate ($)
                </label>
                <input
                  type="number"
                  min="50"
                  value={formData.roomNightlyRate}
                  onChange={(e) => setFormData({ ...formData, roomNightlyRate: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Items / Charges */}
          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                3. Additional Amenities & Services
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {extraItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Description (e.g. Spa Massage)"
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white"
                  />
                  <select
                    value={item.category}
                    onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                    className="w-28 px-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white"
                  >
                    <option value="Dining">Dining</option>
                    <option value="Spa & Wellness">Spa</option>
                    <option value="Concierge">Concierge</option>
                    <option value="Activities">Activities</option>
                    <option value="General">General</option>
                  </select>
                  <div className="relative w-24">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">$</span>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-slate-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method & Status */}
          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              4. Payment Method & Initial Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => {
                    const method = e.target.value;
                    let type = 'Credit Card';
                    if (method.includes('Cash')) type = 'Cash';
                    if (method.includes('Bank') || method.includes('Wire')) type = 'Bank Transfer';
                    if (method.includes('UPI')) type = 'UPI';
                    if (method.includes('Crypto')) type = 'Crypto';
                    setFormData({ ...formData, paymentMethod: method, paymentMethodType: type });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Credit Card (Visa)">Credit Card (Visa)</option>
                  <option value="Credit Card (Mastercard)">Credit Card (Mastercard)</option>
                  <option value="Credit Card (Amex Black)">Credit Card (Amex Black)</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash (Front Desk)">Cash (Front Desk)</option>
                  <option value="Bank Wire / Swift">Bank Wire / Swift</option>
                  <option value="Instant UPI / QR Code">Instant UPI / QR Code</option>
                  <option value="Cryptocurrency (USDT/BTC)">Cryptocurrency (USDT/BTC)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Payment Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Paid">Paid in Full</option>
                  <option value="Partially Paid">Partially Paid (50% Deposit)</option>
                  <option value="Pending">Pending Payment (Due on Departure)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calculations Summary Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Room Tariff ({formData.nights} nights @ ${formData.roomNightlyRate})</span>
              <span className="font-mono text-slate-200">${roomTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Additional Amenities / Services</span>
              <span className="font-mono text-slate-200">${extrasTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Hospitality Tax (12%)</span>
              <span className="font-mono text-slate-200">${taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Service Charge (5%)</span>
              <span className="font-mono text-slate-200">${serviceChargeAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
              <span>Estimated Grand Total</span>
              <span className="font-serif-luxury text-base text-amber-400">
                ${grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeGenerateInvoiceModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <FilePlus className="w-4 h-4 stroke-[2.2]" />
              <span>{isLoading ? 'Generating...' : 'Generate & View Official Folio'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default GenerateInvoiceModal;

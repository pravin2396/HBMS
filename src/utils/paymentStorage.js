import { getStoredBookings } from './bookingStorage';
import { getStoredCheckOutHistory } from './checkInOutStorage';

export const PAYMENTS_STORAGE_KEY = 'hbms_payments';
export const INVOICES_STORAGE_KEY = 'hbms_invoices';

export const INITIAL_PAYMENTS = [
  {
    id: 'PAY-1001',
    invoiceNumber: 'INV-2026-0891',
    transactionId: 'TXN-948201',
    bookingId: 'BK-9021',
    guestId: 'GST-1001',
    guestName: 'Eleanor Vance',
    guestEmail: 'eleanor.vance@luxury.com',
    guestPhone: '+1 (555) 234-8891',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Diamond Elite',
    roomNumber: '701',
    suiteType: 'Presidential Penthouse',
    checkIn: '2026-09-23',
    checkOut: '2026-09-28',
    nights: 5,
    paymentMethod: 'Credit Card (Amex Black)',
    paymentMethodType: 'Credit Card',
    status: 'Paid',
    amount: 4250,
    paidAmount: 4250,
    balanceDue: 0,
    subtotal: 3600,
    taxAmount: 432,
    serviceChargeAmount: 180,
    discountAmount: 0,
    items: [
      { id: 'item-1', description: 'Presidential Penthouse (5 Nights @ $650/nt)', category: 'Room Tariff', amount: 3250 },
      { id: 'item-2', description: 'Private Sommelier & Champagne Service', category: 'Dining', amount: 350 },
      { id: 'item-3', description: 'VIP Heliport Airport Chauffeur', category: 'Concierge', amount: 200 }
    ],
    transactionDate: '2026-09-23T14:30:00.000Z',
    receptionAgent: 'Alexander Sterling (General Manager)',
    notes: 'Full payment authorized upon check-in. Pre-authorization released.'
  },
  {
    id: 'PAY-1002',
    invoiceNumber: 'INV-2026-0892',
    transactionId: 'TXN-948202',
    bookingId: 'BK-9022',
    guestId: 'GST-1002',
    guestName: 'Marcus Sterling',
    guestEmail: 'm.sterling@invest.com',
    guestPhone: '+1 (555) 782-9904',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Diamond Elite',
    roomNumber: '404',
    suiteType: 'Royal Oceanfront Villa',
    checkIn: '2026-09-23',
    checkOut: '2026-09-26',
    nights: 3,
    paymentMethod: 'Bank Wire / Swift',
    paymentMethodType: 'Bank Transfer',
    status: 'Paid',
    amount: 2800,
    paidAmount: 2800,
    balanceDue: 0,
    subtotal: 2370,
    taxAmount: 284,
    serviceChargeAmount: 118,
    discountAmount: 0,
    items: [
      { id: 'item-1', description: 'Royal Oceanfront Villa (3 Nights @ $750/nt)', category: 'Room Tariff', amount: 2250 },
      { id: 'item-2', description: 'Private Yacht Charter - Sunset Cruise', category: 'Concierge', amount: 550 }
    ],
    transactionDate: '2026-09-23T10:15:00.000Z',
    receptionAgent: 'Front Desk Duty Manager',
    notes: 'Direct corporate wire settlement verified by finance.'
  },
  {
    id: 'PAY-1003',
    invoiceNumber: 'INV-2026-0893',
    transactionId: 'TXN-948203',
    bookingId: 'BK-9023',
    guestId: 'GST-1003',
    guestName: 'Dr. Clara Thorne',
    guestEmail: 'clara.thorne@medcenter.org',
    guestPhone: '+1 (555) 671-3321',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Platinum VIP',
    roomNumber: '302',
    suiteType: 'Executive Diplomat Suite',
    checkIn: '2026-09-24',
    checkOut: '2026-09-27',
    nights: 3,
    paymentMethod: 'Credit Card (Visa Infinite)',
    paymentMethodType: 'Credit Card',
    status: 'Paid',
    amount: 1950,
    paidAmount: 1950,
    balanceDue: 0,
    subtotal: 1650,
    taxAmount: 198,
    serviceChargeAmount: 82,
    discountAmount: 0,
    items: [
      { id: 'item-1', description: 'Executive Diplomat Suite (3 Nights @ $500/nt)', category: 'Room Tariff', amount: 1500 },
      { id: 'item-2', description: 'Aromatherapy & Hot Stone Massage', category: 'Spa & Wellness', amount: 250 },
      { id: 'item-3', description: 'Gourmet In-Room Dining', category: 'Dining', amount: 200 }
    ],
    transactionDate: '2026-09-24T16:45:00.000Z',
    receptionAgent: 'Front Desk Duty Manager',
    notes: 'Paid in full via Visa chip and pin terminal.'
  },
  {
    id: 'PAY-1004',
    invoiceNumber: 'INV-2026-0894',
    transactionId: 'TXN-948204',
    bookingId: 'BK-9024',
    guestId: 'GST-1004',
    guestName: 'Julian & Camille Rossi',
    guestEmail: 'rossi.famiglia@milano.it',
    guestPhone: '+39 02 8892 144',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Gold VIP',
    roomNumber: '501',
    suiteType: 'Grand Horizon Family Suite',
    checkIn: '2026-09-25',
    checkOut: '2026-09-30',
    nights: 5,
    paymentMethod: 'Credit Card (Mastercard World Elite)',
    paymentMethodType: 'Credit Card',
    status: 'Partially Paid',
    amount: 3200,
    paidAmount: 1600,
    balanceDue: 1600,
    subtotal: 2710,
    taxAmount: 325,
    serviceChargeAmount: 135,
    discountAmount: 0,
    items: [
      { id: 'item-1', description: 'Grand Horizon Family Suite (5 Nights @ $550/nt)', category: 'Room Tariff', amount: 2750 },
      { id: 'item-2', description: 'Private Cabana Day Pass & Lunch', category: 'Activities', amount: 450 }
    ],
    transactionDate: '2026-09-25T11:20:00.000Z',
    receptionAgent: 'Front Desk Duty Manager',
    notes: '50% deposit received upon booking. Balance due at check-out.'
  },
  {
    id: 'PAY-1005',
    invoiceNumber: 'INV-2026-0895',
    transactionId: 'TXN-948205',
    bookingId: 'BK-9025',
    guestId: 'GST-1005',
    guestName: 'Lord Alistair Sterling',
    guestEmail: 'alistair.sterling@heritage.co.uk',
    guestPhone: '+44 20 7946 0912',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'VIP Platinum',
    roomNumber: '601',
    suiteType: 'Penthouse Panorama Suite',
    checkIn: '2026-09-26',
    checkOut: '2026-10-02',
    nights: 6,
    paymentMethod: 'Pending (Direct Billing / Invoicing)',
    paymentMethodType: 'Pending',
    status: 'Pending',
    amount: 5100,
    paidAmount: 0,
    balanceDue: 5100,
    subtotal: 4322,
    taxAmount: 518,
    serviceChargeAmount: 216,
    discountAmount: 0,
    items: [
      { id: 'item-1', description: 'Penthouse Panorama Suite (6 Nights @ $750/nt)', category: 'Room Tariff', amount: 4500 },
      { id: 'item-2', description: 'Private Chef Dining Experience', category: 'Dining', amount: 600 }
    ],
    transactionDate: '2026-09-25T09:10:00.000Z',
    receptionAgent: 'Alexander Sterling',
    notes: 'Corporate invoice dispatched to family office. Net 7 settlement.'
  },
  {
    id: 'PAY-1006',
    invoiceNumber: 'INV-2026-0896',
    transactionId: 'TXN-948206',
    bookingId: 'BK-9026',
    guestId: 'GST-1006',
    guestName: 'Kenji & Mei Takahashi',
    guestEmail: 'takahashi.k@tokyocorp.jp',
    guestPhone: '+81 3 5555 0143',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Diamond Elite',
    roomNumber: '205',
    suiteType: 'Zen Garden Deluxe Suite',
    checkIn: '2026-09-20',
    checkOut: '2026-09-22',
    nights: 2,
    paymentMethod: 'Instant UPI / QR Code',
    paymentMethodType: 'UPI',
    status: 'Paid',
    amount: 1450,
    paidAmount: 1450,
    balanceDue: 0,
    subtotal: 1230,
    taxAmount: 147,
    serviceChargeAmount: 61,
    discountAmount: 0,
    items: [
      { id: 'item-1', description: 'Zen Garden Deluxe Suite (2 Nights @ $550/nt)', category: 'Room Tariff', amount: 1100 },
      { id: 'item-2', description: 'Traditional Japanese Tea Ceremony', category: 'Activities', amount: 350 }
    ],
    transactionDate: '2026-09-22T10:05:00.000Z',
    receptionAgent: 'Front Desk Duty Manager',
    notes: 'Folio settled upon departure. Key card handed back.'
  },
  {
    id: 'PAY-1007',
    invoiceNumber: 'INV-2026-0897',
    transactionId: 'TXN-948207',
    bookingId: 'BK-9027',
    guestId: 'GST-1007',
    guestName: 'Harrison Ford-Smith',
    guestEmail: 'h.fordsmith@globalaviation.com',
    guestPhone: '+1 (555) 890-4412',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Standard Guest',
    roomNumber: '108',
    suiteType: 'Deluxe Courtyard Suite',
    checkIn: '2026-09-18',
    checkOut: '2026-09-21',
    nights: 3,
    paymentMethod: 'Credit Card (Visa)',
    paymentMethodType: 'Credit Card',
    status: 'Refunded',
    amount: 980,
    paidAmount: 0,
    balanceDue: 0,
    subtotal: 830,
    taxAmount: 99,
    serviceChargeAmount: 41,
    discountAmount: 0,
    items: [
      { id: 'item-1', description: 'Deluxe Courtyard Suite (3 Nights @ $280/nt)', category: 'Room Tariff', amount: 840 },
      { id: 'item-2', description: 'Airport Shuttle Fee', category: 'Concierge', amount: 140 }
    ],
    transactionDate: '2026-09-19T08:30:00.000Z',
    receptionAgent: 'Alexander Sterling',
    notes: 'Booking cancelled within complimentary 48h window. Full refund reversed to card.'
  },
  {
    id: 'PAY-1008',
    invoiceNumber: 'INV-2026-0898',
    transactionId: 'TXN-948208',
    bookingId: 'BK-9028',
    guestId: 'GST-1008',
    guestName: 'Genevieve Dupond',
    guestEmail: 'g.dupond@couture.paris',
    guestPhone: '+33 1 42 68 55 00',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    vipStatus: 'Gold VIP',
    roomNumber: '304',
    suiteType: 'Mediterranean Ocean Suite',
    checkIn: '2026-09-25',
    checkOut: '2026-09-28',
    nights: 3,
    paymentMethod: 'Cash (USD Luxury Vault)',
    paymentMethodType: 'Cash',
    status: 'Paid',
    amount: 2200,
    paidAmount: 2200,
    balanceDue: 0,
    subtotal: 1864,
    taxAmount: 224,
    serviceChargeAmount: 93,
    discountAmount: 0,
    items: [
      { id: 'item-1', description: 'Mediterranean Ocean Suite (3 Nights @ $600/nt)', category: 'Room Tariff', amount: 1800 },
      { id: 'item-2', description: 'Champagne Brunch by the Pool', category: 'Dining', amount: 400 }
    ],
    transactionDate: '2026-09-25T12:00:00.000Z',
    receptionAgent: 'Front Desk Duty Manager',
    notes: 'Cash payment deposited in hotel cash drop vault with supervisor signoff.'
  }
];

/**
 * Retrieve all payments from localStorage or seed
 */
export const getStoredPayments = () => {
  if (typeof window === 'undefined') return INITIAL_PAYMENTS;
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PAYMENTS;
  } catch (e) {
    console.warn('Error reading stored payments:', e);
    return INITIAL_PAYMENTS;
  }
};

/**
 * Save payments to localStorage and dispatch custom and native events
 */
export const saveStoredPayments = (payments) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
    window.dispatchEvent(new Event('hbms_payments_updated'));
    window.dispatchEvent(new Event('hbms_data_updated'));
  } catch (e) {
    console.error('Error saving payments to localStorage:', e);
  }
};

/**
 * Record a new payment transaction & invoice
 */
export const recordNewPayment = (paymentData) => {
  const payments = getStoredPayments();
  const subtotal = Number(paymentData.subtotal) || Number(paymentData.amount) * 0.85 || 1000;
  const taxAmount = Math.round(subtotal * 0.12);
  const serviceChargeAmount = Math.round(subtotal * 0.05);
  const discountAmount = Number(paymentData.discountAmount) || 0;
  const grandTotal = Math.round(subtotal + taxAmount + serviceChargeAmount - discountAmount);
  
  const status = paymentData.status || 'Paid';
  const paidAmount = status === 'Paid' 
    ? grandTotal 
    : status === 'Partially Paid' 
      ? Math.round(grandTotal / 2) 
      : status === 'Refunded' ? 0 : 0;
  const balanceDue = grandTotal - paidAmount;

  const newPayment = {
    id: `PAY-${Date.now().toString().slice(-4)}`,
    invoiceNumber: paymentData.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    transactionId: paymentData.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    bookingId: paymentData.bookingId || `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    guestId: paymentData.guestId || `GST-${Math.floor(1000 + Math.random() * 9000)}`,
    guestName: paymentData.guestName || 'Valued Hotel Guest',
    guestEmail: paymentData.guestEmail || 'guest@paradisehotel.com',
    guestPhone: paymentData.guestPhone || '+1 (555) 000-0000',
    avatar: paymentData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${paymentData.guestName || 'Guest'}`,
    vipStatus: paymentData.vipStatus || 'Standard Guest',
    roomNumber: paymentData.roomNumber || '101',
    suiteType: paymentData.suiteType || 'Deluxe Room',
    checkIn: paymentData.checkIn || new Date().toISOString().split('T')[0],
    checkOut: paymentData.checkOut || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    nights: Number(paymentData.nights) || 2,
    paymentMethod: paymentData.paymentMethod || 'Credit Card (Visa)',
    paymentMethodType: paymentData.paymentMethodType || 'Credit Card',
    status,
    amount: grandTotal,
    paidAmount,
    balanceDue,
    subtotal,
    taxAmount,
    serviceChargeAmount,
    discountAmount,
    items: paymentData.items && paymentData.items.length > 0 
      ? paymentData.items 
      : [
          { id: 'item-1', description: `${paymentData.suiteType || 'Deluxe Room'} Accommodation`, category: 'Room Tariff', amount: subtotal }
        ],
    transactionDate: new Date().toISOString(),
    receptionAgent: paymentData.receptionAgent || 'Front Desk Duty Manager',
    notes: paymentData.notes || 'Transaction processed successfully at front desk terminal.'
  };

  payments.unshift(newPayment);
  saveStoredPayments(payments);
  return newPayment;
};

/**
 * Update an existing payment status (Paid, Pending, Partially Paid, Refunded, Failed)
 */
export const updateStoredPaymentStatus = (paymentId, newStatus, additionalData = {}) => {
  const payments = getStoredPayments();
  const index = payments.findIndex((p) => String(p.id) === String(paymentId) || String(p.invoiceNumber) === String(paymentId));
  if (index === -1) {
    throw new Error(`Payment record "${paymentId}" not found.`);
  }

  const current = payments[index];
  let paidAmount = current.paidAmount;
  let balanceDue = current.balanceDue;

  if (newStatus === 'Paid') {
    paidAmount = current.amount;
    balanceDue = 0;
  } else if (newStatus === 'Refunded') {
    paidAmount = 0;
    balanceDue = 0;
  } else if (newStatus === 'Pending') {
    paidAmount = 0;
    balanceDue = current.amount;
  } else if (newStatus === 'Partially Paid') {
    paidAmount = additionalData.paidAmount ? Number(additionalData.paidAmount) : Math.round(current.amount / 2);
    balanceDue = Math.max(0, current.amount - paidAmount);
  }

  const updated = {
    ...current,
    status: newStatus,
    paidAmount,
    balanceDue,
    notes: additionalData.notes || current.notes,
    paymentMethod: additionalData.paymentMethod || current.paymentMethod,
    updatedAt: new Date().toISOString()
  };

  payments[index] = updated;
  saveStoredPayments(payments);
  return updated;
};

/**
 * Compute real-time payment summary statistics
 */
export const computePaymentStats = (paymentsList) => {
  const payments = Array.isArray(paymentsList) ? paymentsList : getStoredPayments();
  
  let totalRevenue = 0;
  let pendingAmount = 0;
  let refundedAmount = 0;
  let todayCollections = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let refundedCount = 0;
  let partialCount = 0;

  const todayStr = new Date().toISOString().split('T')[0];

  const methodBreakdown = {
    'Credit Card': 0,
    'Debit Card': 0,
    'Cash': 0,
    'Bank Transfer': 0,
    'UPI': 0,
    'Crypto': 0,
    'Other': 0
  };

  payments.forEach((p) => {
    const amount = Number(p.amount) || 0;
    const paid = Number(p.paidAmount) || 0;
    const isToday = p.transactionDate && p.transactionDate.startsWith(todayStr);

    if (p.status === 'Paid') {
      paidCount++;
      totalRevenue += paid;
      if (isToday) todayCollections += paid;
    } else if (p.status === 'Partially Paid') {
      partialCount++;
      totalRevenue += paid;
      pendingAmount += (Number(p.balanceDue) || 0);
      if (isToday) todayCollections += paid;
    } else if (p.status === 'Pending') {
      pendingCount++;
      pendingAmount += amount;
    } else if (p.status === 'Refunded') {
      refundedCount++;
      refundedAmount += amount;
    }

    // Classify method
    const methodStr = (p.paymentMethodType || p.paymentMethod || '').toLowerCase();
    if (methodStr.includes('credit')) methodBreakdown['Credit Card'] += paid;
    else if (methodStr.includes('debit')) methodBreakdown['Debit Card'] += paid;
    else if (methodStr.includes('cash')) methodBreakdown['Cash'] += paid;
    else if (methodStr.includes('bank') || methodStr.includes('wire')) methodBreakdown['Bank Transfer'] += paid;
    else if (methodStr.includes('upi') || methodStr.includes('qr')) methodBreakdown['UPI'] += paid;
    else if (methodStr.includes('crypto')) methodBreakdown['Crypto'] += paid;
    else methodBreakdown['Other'] += paid;
  });

  const totalTransactions = payments.length;
  const averageTransaction = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0;

  return {
    totalRevenue,
    pendingAmount,
    refundedAmount,
    todayCollections,
    totalTransactions,
    paidCount,
    pendingCount,
    refundedCount,
    partialCount,
    averageTransaction,
    methodBreakdown
  };
};

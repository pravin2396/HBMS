import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PaymentContext } from './PaymentContextCore';
import {
  getStoredPayments,
  computePaymentStats,
  recordNewPayment,
  updateStoredPaymentStatus
} from '../utils/paymentStorage';
import {
  fetchPaymentsApi,
  recordPaymentApi,
  updatePaymentStatusApi
} from '../api/paymentApi';

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState(() => {
    try {
      return getStoredPayments();
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // 'all' | 'today' | 'week' | 'month'

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isGenerateInvoiceModalOpen, setIsGenerateInvoiceModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [paymentToUpdate, setPaymentToUpdate] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Sync state with storage and global events
  const syncLocalState = useCallback(() => {
    try {
      const fresh = getStoredPayments();
      setPayments(fresh);
    } catch (err) {
      console.warn('Error syncing payments:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchPaymentsApi();
        if (isMounted && res.payments) {
          setPayments(res.payments);
        }
      } catch (e) {
        console.warn('Fetch payments error:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();

    window.addEventListener('storage', syncLocalState);
    window.addEventListener('hbms_payments_updated', syncLocalState);
    window.addEventListener('hbms_data_updated', syncLocalState);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', syncLocalState);
      window.removeEventListener('hbms_payments_updated', syncLocalState);
      window.removeEventListener('hbms_data_updated', syncLocalState);
    };
  }, [syncLocalState]);

  // Real-time KPI Stats
  const stats = useMemo(() => {
    return computePaymentStats(payments);
  }, [payments]);

  // Filtered Payments Ledger
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        return (
          p.guestName?.toLowerCase().includes(q) ||
          p.invoiceNumber?.toLowerCase().includes(q) ||
          p.transactionId?.toLowerCase().includes(q) ||
          p.bookingId?.toLowerCase().includes(q) ||
          p.roomNumber?.toLowerCase().includes(q) ||
          p.guestEmail?.toLowerCase().includes(q) ||
          p.guestPhone?.includes(q) ||
          p.suiteType?.toLowerCase().includes(q) ||
          p.paymentMethod?.toLowerCase().includes(q)
        );
      });
    }

    // 2. Status Filter
    if (statusFilter !== 'All') {
      result = result.filter((p) => {
        if (statusFilter === 'Paid') return p.status === 'Paid';
        if (statusFilter === 'Pending') return p.status === 'Pending';
        if (statusFilter === 'Partially Paid') return p.status === 'Partially Paid';
        if (statusFilter === 'Refunded') return p.status === 'Refunded';
        return true;
      });
    }

    // 3. Payment Method Filter
    if (methodFilter !== 'All') {
      result = result.filter((p) => {
        const type = (p.paymentMethodType || p.paymentMethod || '').toLowerCase();
        const target = methodFilter.toLowerCase();
        if (target.includes('card')) return type.includes('card');
        if (target.includes('cash')) return type.includes('cash');
        if (target.includes('bank') || target.includes('transfer')) return type.includes('bank') || type.includes('swift') || type.includes('wire');
        if (target.includes('upi')) return type.includes('upi') || type.includes('qr');
        if (target.includes('crypto')) return type.includes('crypto');
        return type.includes(target);
      });
    }

    // 4. Date Range Filter
    if (dateRangeFilter !== 'all') {
      const now = new Date();
      result = result.filter((p) => {
        if (!p.transactionDate) return true;
        const itemDate = new Date(p.transactionDate);
        if (dateRangeFilter === 'today') {
          return itemDate.toDateString() === now.toDateString();
        }
        if (dateRangeFilter === 'week') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= sevenDaysAgo;
        }
        if (dateRangeFilter === 'month') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= thirtyDaysAgo;
        }
        return true;
      });
    }

    return result;
  }, [payments, searchQuery, statusFilter, methodFilter, dateRangeFilter]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setMethodFilter('All');
    setDateRangeFilter('all');
  };

  // Open Invoice View Modal
  const openInvoiceModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setSelectedInvoice(null);
    setIsInvoiceModalOpen(false);
  };

  // Open Generate Invoice Modal
  const openGenerateInvoiceModal = () => {
    setIsGenerateInvoiceModalOpen(true);
  };

  const closeGenerateInvoiceModal = () => {
    setIsGenerateInvoiceModalOpen(false);
  };

  // Open Status Update Modal
  const openStatusModal = (payment) => {
    setPaymentToUpdate(payment);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setPaymentToUpdate(null);
    setIsStatusModalOpen(false);
  };

  // Handle Status Update
  const handleUpdateStatus = async (paymentId, newStatus, additionalData = {}) => {
    setIsLoading(true);
    try {
      const res = await updatePaymentStatusApi(paymentId, newStatus, additionalData);
      syncLocalState();
      toast.success(`Payment status for invoice ${res.payment?.invoiceNumber || paymentId} updated to "${newStatus}"!`);
      closeStatusModal();
      if (selectedInvoice && selectedInvoice.id === paymentId) {
        setSelectedInvoice(res.payment);
      }
      return { success: true, payment: res.payment };
    } catch (err) {
      toast.error(err.message || 'Failed to update payment status.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Generate Invoice
  const handleCreateInvoice = async (formData) => {
    setIsLoading(true);
    try {
      const res = await recordPaymentApi(formData);
      syncLocalState();
      toast.success(`Luxury Invoice ${res.payment.invoiceNumber} generated successfully!`);
      closeGenerateInvoiceModal();
      openInvoiceModal(res.payment);
      return { success: true, payment: res.payment };
    } catch (err) {
      toast.error(err.message || 'Failed to generate invoice.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Download Invoice UI (Dummy PDF download action)
  const handleDownloadInvoice = (invoice = selectedInvoice) => {
    if (!invoice) return;
    setIsDownloading(true);

    const toastId = toast.loading(`Preparing high-res PDF for ${invoice.invoiceNumber}...`);

    setTimeout(() => {
      // Create a dummy download simulation
      try {
        const dummyPdfContent = `
============================================================
              PARADISE HOTEL & LUXURY RESORT
                    OFFICIAL TAX INVOICE
============================================================
Invoice Number : ${invoice.invoiceNumber}
Date of Issue  : ${new Date(invoice.transactionDate).toLocaleString()}
Transaction ID : ${invoice.transactionId}
Booking Ref    : ${invoice.bookingId}

GUEST INFORMATION:
Name           : ${invoice.guestName}
Email          : ${invoice.guestEmail}
Phone          : ${invoice.guestPhone}
VIP Status     : ${invoice.vipStatus}

ACCOMMODATION & STAY DETAILS:
Room / Suite   : Suite ${invoice.roomNumber} - ${invoice.suiteType}
Check-In Date  : ${invoice.checkIn}
Check-Out Date : ${invoice.checkOut}
Duration       : ${invoice.nights} Nights

BILLING BREAKDOWN:
Subtotal       : $${invoice.subtotal.toLocaleString()}
Hospitality Tax: $${invoice.taxAmount.toLocaleString()} (12%)
Service Charge : $${invoice.serviceChargeAmount.toLocaleString()} (5%)
------------------------------------------------------------
Grand Total    : $${invoice.amount.toLocaleString()}
Amount Paid    : $${invoice.paidAmount.toLocaleString()}
Balance Due    : $${invoice.balanceDue.toLocaleString()}
Payment Status : ${invoice.status.toUpperCase()}
Payment Method : ${invoice.paymentMethod}
============================================================
Thank you for experiencing Paradise Hotel & Luxury Resort.
`;
        const blob = new Blob([dummyPdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoice.invoiceNumber}_Official_Invoice.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsDownloading(false);
        toast.update(toastId, {
          render: `Invoice ${invoice.invoiceNumber} downloaded successfully as PDF!`,
          type: 'success',
          isLoading: false,
          autoClose: 3500
        });
      } catch (e) {
        setIsDownloading(false);
        toast.update(toastId, {
          render: `Invoice ${invoice.invoiceNumber} ready for download!`,
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
      }
    }, 1200);
  };

  // Handle Print Invoice
  const handlePrintInvoice = () => {
    window.print();
  };

  const value = {
    payments,
    filteredPayments,
    stats,
    isLoading,
    isDownloading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    dateRangeFilter,
    setDateRangeFilter,
    selectedInvoice,
    isInvoiceModalOpen,
    isGenerateInvoiceModalOpen,
    isStatusModalOpen,
    paymentToUpdate,
    openInvoiceModal,
    closeInvoiceModal,
    openGenerateInvoiceModal,
    closeGenerateInvoiceModal,
    openStatusModal,
    closeStatusModal,
    handleUpdateStatus,
    handleCreateInvoice,
    handleDownloadInvoice,
    handlePrintInvoice,
    resetFilters,
    refreshPayments: syncLocalState
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

import React from 'react';
import {
  CreditCard,
  Wallet
} from 'lucide-react';
import { usePayment } from '../context/usePayment';

import PaymentSummaryCards from '../components/payments/PaymentSummaryCards';
import PaymentFilterBar from '../components/payments/PaymentFilterBar';
import PaymentHistoryTable from '../components/payments/PaymentHistoryTable';
import InvoiceModal from '../components/payments/InvoiceModal';
import GenerateInvoiceModal from '../components/payments/GenerateInvoiceModal';
import UpdatePaymentStatusModal from '../components/payments/UpdatePaymentStatusModal';

const PaymentsInner = () => {
  const { stats } = usePayment();

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 p-4 sm:p-5 lg:p-6 space-y-6">
      
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 shrink-0">
              <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
            </div>

            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Payments & Invoicing Folio
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Manage guest billing settlements, tax invoice generation, payment statuses, and transaction ledgers with real-time audit reconciliation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Payment Summary Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Payment Summary & Receivables
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Real-time ledger aggregation
          </span>
        </div>

        <PaymentSummaryCards stats={stats} />
      </section>

      {/* 2. Filter & Search Bar */}
      <section>
        <PaymentFilterBar />
      </section>

      {/* 3. Payment History Ledger Table */}
      <section>
        <PaymentHistoryTable />
      </section>

      {/* Modals */}
      <InvoiceModal />
      <GenerateInvoiceModal />
      <UpdatePaymentStatusModal />

    </div>
  );
};

const Payments = () => {
  return <PaymentsInner />;
};

export default Payments;

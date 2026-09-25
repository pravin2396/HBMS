import React from 'react';
import {
  DollarSign,
  Clock,
  TrendingUp,
  RotateCcw,
  Receipt,
  Sparkles,
  CreditCard,
  ShieldCheck
} from 'lucide-react';

const PaymentSummaryCards = ({ stats }) => {
  const {
    totalRevenue = 0,
    pendingAmount = 0,
    refundedAmount = 0,
    todayCollections = 0,
    totalTransactions = 0,
    paidCount = 0,
    pendingCount = 0,
    refundedCount = 0
  } = stats || {};

  const summaryCards = [
    {
      title: 'Total Revenue Collected',
      value: `$${totalRevenue.toLocaleString()}`,
      subtext: `${paidCount} settled transactions`,
      icon: DollarSign,
      accent: 'from-amber-500 to-amber-600',
      badge: '+18.4% vs last mo',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Pending & Due Receivables',
      value: `$${pendingAmount.toLocaleString()}`,
      subtext: `${pendingCount} invoices awaiting payment`,
      icon: Clock,
      accent: 'from-yellow-500 to-amber-500',
      badge: 'Action Required',
      badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    },
    {
      title: "Today's Collections",
      value: `$${todayCollections.toLocaleString()}`,
      subtext: 'Front desk & digital settlements',
      icon: TrendingUp,
      accent: 'from-emerald-500 to-teal-600',
      badge: 'Live Today',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Refunds & Reversals',
      value: `$${refundedAmount.toLocaleString()}`,
      subtext: `${refundedCount} transactions refunded`,
      icon: RotateCcw,
      accent: 'from-purple-500 to-pink-600',
      badge: 'Audited',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Total Transactions',
      value: totalTransactions,
      subtext: `${paidCount} paid • ${pendingCount} pending`,
      icon: Receipt,
      accent: 'from-blue-500 to-indigo-600',
      badge: 'Folio Ledger',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {summaryCards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-4 hover:border-slate-700 transition-all duration-300 shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/10`}
              >
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                {card.title}
              </p>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white tracking-tight">
                {card.value}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentSummaryCards;

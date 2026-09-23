import React from 'react';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  BedDouble,
  DollarSign,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Occupancy Rate',
      value: '88.4%',
      change: '+4.2% from last week',
      icon: BedDouble,
      accent: 'from-amber-500 to-amber-600'
    },
    {
      title: "Today's Check-Ins",
      value: '24 Guests',
      change: '6 VIP suites arriving',
      icon: CalendarCheck,
      accent: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Total Revenue (MTD)',
      value: '$148,290',
      change: '+12.8% target pacing',
      icon: DollarSign,
      accent: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Active VIP Bookings',
      value: '18 Suites',
      change: '100% satisfaction',
      icon: Sparkles,
      accent: 'from-purple-500 to-pink-600'
    }
  ];

  const recentBookings = [
    {
      id: 'BK-9021',
      guest: 'Eleanor Vance',
      suite: 'Presidential Penthouse (Suite 701)',
      dates: 'Sep 24 - Sep 29',
      status: 'Confirmed',
      amount: '$4,250',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'BK-9022',
      guest: 'Marcus Sterling',
      suite: 'Royal Oceanfront Villa (Suite 404)',
      dates: 'Sep 25 - Sep 28',
      status: 'Check-In Today',
      amount: '$2,800',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      id: 'BK-9023',
      guest: 'Dr. Clara Thorne',
      suite: 'Executive Diplomat Suite (Suite 302)',
      dates: 'Sep 27 - Oct 02',
      status: 'Confirmed',
      amount: '$3,100',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'BK-9024',
      guest: 'Liam O’Connor',
      suite: 'Deluxe Heritage King (Suite 112)',
      dates: 'Oct 01 - Oct 05',
      status: 'Pending Deposit',
      amount: '$1,650',
      badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-500/60 shadow-lg shadow-amber-500/10"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {user?.role || 'User'}
                  </span>
                  <span className="text-xs text-slate-400">Authenticated via LocalStorage</span>
                </div>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  Logged in as <span className="text-slate-200">{user?.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                Manage Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 shadow-lg relative group hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {item.title}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${item.accent} text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif-luxury">
                  {item.value}
                </div>
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{item.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity & Bookings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-white">
                Upcoming Luxury Reservations
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time booking and guest check-in monitor
              </p>
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" /> Live Sync Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-2">Booking ID</th>
                  <th className="pb-3">Guest Name</th>
                  <th className="pb-3">Suite Type</th>
                  <th className="pb-3">Stay Dates</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-2 font-mono text-xs text-amber-400 font-semibold">
                      {b.id}
                    </td>
                    <td className="py-3.5 font-medium text-slate-200">
                      {b.guest}
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {b.suite}
                    </td>
                    <td className="py-3.5 text-slate-300">
                      {b.dates}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${b.badgeColor}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2 font-semibold text-slate-200">
                      {b.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Authentication Info Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Module 1: Authentication Verified</h3>
              <p className="text-xs text-slate-400">
                Session active, password protection active, role authorization guarded by React Router.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 font-mono">
            User ID: {user?.id}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

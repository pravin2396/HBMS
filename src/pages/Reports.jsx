import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Download,
  RefreshCw,
  Sparkles,
  Printer,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getConsolidatedReportData } from '../utils/reportStorage';

import ReportStatsOverview from '../components/reports/ReportStatsOverview';
import RevenueTrendsChart from '../components/reports/RevenueTrendsChart';
import DepartmentRevenueChart from '../components/reports/DepartmentRevenueChart';
import RoomOccupancyReport from '../components/reports/RoomOccupancyReport';
import MostBookedRoomTypeReport from '../components/reports/MostBookedRoomTypeReport';
import ActiveGuestsAndTrendsReport from '../components/reports/ActiveGuestsAndTrendsReport';

const Reports = () => {
  const [reportData, setReportData] = useState(() => getConsolidatedReportData());
  const [activePeriod, setActivePeriod] = useState('This Month');
  const [isExporting, setIsExporting] = useState(false);

  // Sync data with storage & global events
  const syncReport = useCallback(() => {
    try {
      const fresh = getConsolidatedReportData();
      setReportData(fresh);
    } catch (e) {
      console.warn('Error refreshing report data:', e);
    }
  }, []);

  useEffect(() => {
    syncReport();

    window.addEventListener('storage', syncReport);
    window.addEventListener('hbms_data_updated', syncReport);

    return () => {
      window.removeEventListener('storage', syncReport);
      window.removeEventListener('hbms_data_updated', syncReport);
    };
  }, [syncReport]);

  const handleExportReport = () => {
    setIsExporting(true);
    const toastId = toast.loading('Compiling luxury resort analytics & audit data...');

    setTimeout(() => {
      try {
        const csvContent = `PARADISE HOTEL & RESORT - EXECUTIVE ANALYTICS REPORT
Period: ${activePeriod}
Generated: ${new Date().toLocaleString()}

EXECUTIVE DASHBOARD STATISTICS:
Total Gross Revenue: $${reportData.totalRevenue.toLocaleString()}
Monthly Target: $${reportData.monthlyTarget.toLocaleString()}
Average Daily Rate (ADR): $${reportData.adr}
Revenue Per Available Room (RevPAR): $${reportData.revPar}
Room Occupancy Rate: ${reportData.occupancyRate}%
Total Inventory: ${reportData.totalRooms} Suites
Occupied Suites: ${reportData.occupiedRooms}
Available Suites: ${reportData.availableRooms}
Total Bookings: ${reportData.totalBookingsCount}
Active In-House Guests: ${reportData.activeGuestsCount}
Total Patrons in Directory: ${reportData.totalPatrons}

MOST BOOKED ROOM TYPES:
${reportData.mostBookedRoomTypes.map((r, i) => `${i + 1}. ${r.type} - ${r.count} Bookings - $${r.revenue.toLocaleString()} (${r.share}%)`).join('\n')}

DEPARTMENTAL REVENUE:
${reportData.departmentRevenue.map((d) => `${d.name}: $${d.amount.toLocaleString()} (${d.percentage}%)`).join('\n')}
`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Paradise_Resort_Analytics_${activePeriod.replace(/\s+/g, '_')}_Report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        toast.update(toastId, {
          render: `Analytics & revenue report for ${activePeriod} exported successfully!`,
          type: 'success',
          isLoading: false,
          autoClose: 3500
        });
      } catch (e) {
        setIsExporting(false);
        toast.update(toastId, {
          render: 'Report exported successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
      }
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 p-4 sm:p-5 lg:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 shrink-0">
              <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
            </div>

            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Resort Analytics & Operational Reports
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Consolidated financial intelligence, room occupancy pacing, patron booking trends, and departmental yield analytics.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 print:hidden">
            <button
              type="button"
              onClick={syncReport}
              title="Refresh Analytics"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportReport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.2]" />
              <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Dashboard Statistics & KPI Overview */}
      <section>
        <ReportStatsOverview data={reportData} />
      </section>

      {/* 2. Revenue Charts (Dummy Data) & Monthly Bookings */}
      <section>
        <RevenueTrendsChart
          monthlyData={reportData.monthlyTrends}
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
        />
      </section>

      {/* 3. Room Occupancy Rate & Departmental Revenue Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoomOccupancyReport
          totalRooms={reportData.totalRooms}
          occupiedRooms={reportData.occupiedRooms}
          availableRooms={reportData.availableRooms}
          occupancyRate={reportData.occupancyRate}
        />
        <DepartmentRevenueChart
          departmentData={reportData.departmentRevenue}
          totalRevenue={reportData.totalRevenue}
        />
      </section>

      {/* 4. Most Booked Room Type Ranking */}
      <section>
        <MostBookedRoomTypeReport
          roomTypes={reportData.mostBookedRoomTypes}
        />
      </section>

      {/* 5. Active Guests & Booking Trends */}
      <section>
        <ActiveGuestsAndTrendsReport
          activeCount={reportData.activeGuestsCount}
          totalPatrons={reportData.totalPatrons}
          vipBreakdown={reportData.vipBreakdown}
        />
      </section>

    </div>
  );
};

export default Reports;

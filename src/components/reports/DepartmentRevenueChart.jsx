import React from 'react';
import { PieChart, Utensils, BedDouble, Sparkles, GlassWater } from 'lucide-react';

const DepartmentRevenueChart = ({ departmentData, totalRevenue }) => {
  const departments = departmentData || [];
  const grandTotal = totalRevenue || 248500;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
              Revenue by Resort Department
            </h3>
            <p className="text-[11px] text-slate-400">
              Income distribution across primary hotel operational centers
            </p>
          </div>
        </div>

        <span className="font-serif-luxury text-sm font-bold text-amber-400">
          ${grandTotal.toLocaleString()}
        </span>
      </div>

      {/* Segmented Stacked Progress Bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-950 p-0.5 border border-slate-800 gap-0.5">
        {departments.map((dept, idx) => (
          <div
            key={idx}
            style={{ width: `${dept.percentage}%` }}
            className={`h-full rounded-sm ${dept.color} transition-all duration-500`}
            title={`${dept.name}: ${dept.percentage}% ($${dept.amount.toLocaleString()})`}
          />
        ))}
      </div>

      {/* Department Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {departments.map((dept, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${dept.color}`}></span>
                <span className="text-xs font-semibold text-slate-200">
                  {dept.name}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 pl-4 block">
                {dept.percentage}% of gross collections
              </span>
            </div>

            <div className="text-right">
              <span className="font-serif-luxury text-sm font-bold text-white block">
                ${dept.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentRevenueChart;

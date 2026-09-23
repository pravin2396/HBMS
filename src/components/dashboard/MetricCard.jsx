import React from 'react';

const MetricCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  accent = 'from-amber-500 to-amber-600'
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 shadow-lg group hover:border-slate-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${accent} text-white shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform`}>
          {Icon && <Icon className="w-4 h-4 stroke-[2.2]" />}
        </div>
      </div>

      <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif-luxury">
        {value}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {subtext && <span className="text-slate-400 truncate">{subtext}</span>}
        {trend && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              trendPositive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

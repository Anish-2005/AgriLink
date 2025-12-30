import React from 'react';

export default function StatsGrid({ stats }) {
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <div key={i} className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-800 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-white">
              <s.icon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xl font-extrabold">{s.value}</div>
              <div className="text-sm font-semibold text-emerald-700">{s.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

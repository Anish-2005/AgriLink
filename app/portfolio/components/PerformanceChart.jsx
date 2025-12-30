import React from 'react';

export default function PerformanceChart({ displayStats, displaySalesData }) {
  return (
    <div className="mt-16 bg-white rounded-3xl shadow-2xl p-8 border-2 border-emerald-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-emerald-800 drop-shadow-lg">Listing Performance</h2>
          <p className="text-emerald-900 font-semibold mt-2">Monthly earnings and listing trends</p>
        </div>
        <div className="flex space-x-2">
          {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-xl font-extrabold transition-all duration-300 border-2 ${
                period === 'Monthly'
                  ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-white border-emerald-600 shadow-lg'
                  : 'bg-white text-emerald-700 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 flex items-end justify-center space-x-6 pb-8">
        {[45, 70, 100, 85, 125, 95, 65].map((height, index) => (
          <div key={index} className="relative flex flex-col items-center w-12" data-aos="fade-up" data-aos-delay={index * 100}>
            <div
              className="w-full bg-gradient-to-t from-emerald-500 to-lime-400 rounded-t-2xl transition-all duration-1000 ease-out shadow-lg"
              style={{ height: `${height}px` }}
            />
            <div className="mt-3 text-sm font-bold text-emerald-700">{['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][index]}</div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-extrabold text-emerald-800">₹{height * 1000}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        {[
          { label: 'Highest Listing', value: '₹28,500', subtext: 'Rice Straw • 850kg', color: 'from-emerald-500 to-teal-500' },
          { label: 'Avg. Price/Kg', value: `₹${Math.round(displayStats.averagePrice)}`, subtext: 'Based on completed listings', color: 'from-amber-500 to-orange-500' },
          { label: 'Top Item', value: displaySalesData[0]?.item || 'Rice Straw', subtext: `${displayStats.totalWeight}kg listed`, color: 'from-blue-500 to-indigo-500' },
          { label: 'Recent Listing', value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(displaySalesData[0]?.price * displaySalesData[0]?.weight || 0), subtext: displaySalesData[0]?.item || 'Wheat Straw', color: 'from-violet-500 to-purple-500' }
        ].map((metric, idx) => (
          <div key={idx} className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-300 rounded-2xl p-6">
            <p className="text-sm font-bold text-emerald-700 mb-2">{metric.label}</p>
            <p className="text-2xl font-extrabold text-emerald-800">{metric.value}</p>
            <p className="text-xs text-emerald-600 mt-1">{metric.subtext}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

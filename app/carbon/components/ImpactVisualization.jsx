import React from 'react';
import { motion } from 'framer-motion';

export default function ImpactVisualization({ displaySalesData, displayStats }) {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const tokensArr = [0.8, 1.2, 1.8, 2.1, 2.4, 3.2];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-emerald-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-emerald-800 drop-shadow-lg">Environmental Impact Progress</h2>
        <div className="text-sm text-emerald-700 font-bold bg-emerald-100 px-4 py-2 rounded-xl border-2 border-emerald-300">Last 6 Months</div>
      </div>

      <div className="h-64 flex items-end justify-center space-x-4 pb-8">
        {tokensArr.map((tokens, index) => (
          <div key={index} className="relative flex flex-col items-center w-16" data-aos="fade-up" data-aos-delay={index * 100}>
            <motion.div
              className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-2xl relative"
              initial={{ height: 0 }}
              animate={{ height: `${tokens * 60}px` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-extrabold text-emerald-800">{tokens}</div>
            </motion.div>
            <div className="mt-3 text-sm font-bold text-emerald-700">{months[index]}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        {[
          { label: 'Verified by', value: 'UN SDG Standards', color: 'from-emerald-500 to-teal-500' },
          { label: 'Carbon Audit', value: 'Quarterly Reports', color: 'from-blue-500 to-indigo-500' },
          { label: 'Token Liquidity', value: '₹850/Ton Market', color: 'from-violet-500 to-purple-500' },
          { label: 'Farmer Satisfaction', value: '98% Positive', color: 'from-amber-500 to-orange-500' }
        ].map((item, idx) => (
          <div key={idx} className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-300 rounded-2xl p-6">
            <p className="text-sm font-bold text-emerald-700 mb-2">{item.label}</p>
            <p className="text-xl font-extrabold text-emerald-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

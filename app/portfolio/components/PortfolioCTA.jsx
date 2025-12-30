import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PortfolioCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-emerald-50 border-y-4 border-emerald-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-6">Grow Your Agricultural Portfolio</h2>
        <p className="text-xl text-emerald-900 mb-10 font-semibold">Maximize your earnings and track performance with our comprehensive portfolio dashboard.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-500 hover:scale-105">
            <span className="flex items-center justify-center space-x-2">
              <span>Upload New Waste</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300">View Market Insights</button>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Download, ArrowRight, BarChart3 } from 'lucide-react';

export default function Hero({ handleDownloadReport, refreshData, loading, portfolioStats }) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-lime-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <span className="text-base font-extrabold text-emerald-700">Portfolio Dashboard</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
              Your Waste
              <span className="py-2 block bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                Trading Portfolio
              </span>
            </h1>

            <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold">
              Track all your agricultural waste listings, earnings, and transaction history in one comprehensive dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleDownloadReport} className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500 hover:scale-105">
                <span className="flex items-center justify-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Download Report</span>
                </span>
              </button>

              <button
                onClick={refreshData}
                className="group px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4v5h.582"/></svg>
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-emerald-100 rounded-3xl blur-2xl opacity-40 border-4 border-emerald-500"></div>
            <div className="relative bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-500 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                {portfolioStats.map((stat, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-gradient-to-br ${stat.color} p-2 rounded-xl`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-emerald-700 font-bold">{stat.label}</p>
                        <p className="text-xl font-extrabold text-emerald-800">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-400 p-2 rounded-xl">
                    <svg className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-800">Farmer Rating</p>
                    <div className="flex items-center">
                      <span className="text-xl font-extrabold text-amber-800 mr-2">4.8</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

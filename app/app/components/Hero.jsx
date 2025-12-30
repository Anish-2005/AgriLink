import React from 'react';
import { Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-lime-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="text-base font-extrabold text-emerald-700">AI-Powered Waste Analysis</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
            Transform Your
            <span className="py-2 block bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
              Agricultural Waste
            </span>
          </h1>

          <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold max-w-3xl mx-auto">
            Upload photos or describe your agricultural waste. Our AI instantly analyzes quality, estimates value, and connects you with verified buyers.
          </p>

          <div className="flex justify-center space-x-4 pt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-lime-400 border-2 border-emerald-500 flex items-center justify-center text-white font-extrabold shadow-md">
                {['R', 'P', 'A', 'S'][i]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

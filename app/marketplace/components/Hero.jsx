import { Zap, ArrowRight, TrendingUp } from 'lucide-react';

export default function Hero({ marketPrices }) {
  return (
    <div className="p-20 mt-12 grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
          <Zap className="h-4 w-4 text-emerald-600" />
          <span className="text-base font-extrabold text-emerald-700">Live Industrial Tenders</span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
          Premium Market for
          <span className="block bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
            Agricultural Waste
          </span>
        </h1>

        <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold">
          Connect directly with 500+ verified industries looking to purchase your agricultural waste at premium prices with instant payments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500 hover:scale-105">
            <span className="flex items-center justify-center space-x-2">
              <span>Post Your Waste</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300">
            How It Works
          </button>
        </div>

        <div className="flex items-center space-x-8 pt-4">
          <div className="flex -space-x-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-lime-400 border-2 border-emerald-500 flex items-center justify-center text-white font-extrabold shadow-md">
                {['T', 'B', 'P', 'M'][i]}
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <TrendingUp key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-emerald-900 mt-1 font-extrabold">Trusted by 500+ industrial buyers</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-emerald-100 rounded-3xl blur-2xl opacity-40 border-4 border-emerald-500"></div>
        <div className="relative bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-500 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-lime-400 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-emerald-700 font-bold uppercase tracking-wide">Current Market Price</p>
              <p className="text-3xl font-extrabold text-emerald-800">₹1,850 / ton</p>
            </div>
          </div>

          <div className="space-y-4">
            {marketPrices.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-emerald-200 last:border-0">
                <span className="text-emerald-800 font-semibold">{item.waste}</span>
                <span className="font-extrabold text-emerald-700">{item.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 font-semibold flex items-center">
              <Zap className="h-4 w-4 text-amber-800 mr-2" />
              Pro Tip: Prices updated daily based on demand and quality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

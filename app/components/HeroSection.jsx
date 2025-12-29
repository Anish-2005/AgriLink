'use client'
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Star, TrendingUp } from 'lucide-react';

export default function HeroSection({ user, signinBtnLoading }) {
  const router = useRouter();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-lime-100 to-white rounded-full blur-3xl border-4 border-emerald-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-base font-extrabold text-emerald-700">AI-Powered Marketplace</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
              From Waste to
              <span className="block bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                Wealth
              </span>
            </h1>

            <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold">
              AgriLink's AI-powered platform transforms agricultural waste into valuable resources, creating income for farmers and sustainable materials for industries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/app')}
                className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl shadow-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-500"
              >
                <span className="flex items-center justify-center space-x-2">
                  {signinBtnLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <span>{user ? 'Start Selling Waste' : 'Be a member'}</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:border-emerald-700 hover:text-white hover:bg-emerald-600/90 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md">
                <span>How It Works</span>
              </button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-lime-400 border-2 border-emerald-500 flex items-center justify-center text-white font-extrabold shadow-md">
                    {['R', 'P', 'A', 'S'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-emerald-900 mt-1 font-extrabold">Trusted by 10,000+ farmers</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-emerald-100 rounded-3xl blur-2xl opacity-40 border-4 border-emerald-500"></div>
            <img
              src="https://earth.org/wp-content/uploads/2022/03/Untitled-design-2022-03-18T144807.712.jpg"
              alt="Agricultural waste"
              className="relative rounded-3xl shadow-2xl w-full h-auto border-4 border-emerald-500"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border-2 border-emerald-500">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-500 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-emerald-900 font-extrabold">Monthly Revenue</p>
                  <p className="text-xl font-extrabold text-emerald-800">₹45,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-white border-y-4 border-emerald-500 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl border-4 border-emerald-500"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl border-4 border-emerald-500"></div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-6 border-b-4 border-emerald-500 pb-2">
          Ready to transform your agricultural waste into profit?
        </h2>
        <p className="text-xl text-emerald-900 mb-10 font-semibold">
          Join thousands of farmers already benefiting from AgriLink's smart marketplace.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="group px-8 py-4 bg-emerald-600 text-white rounded-xl font-extrabold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-emerald-500">
            <span className="flex items-center justify-center space-x-2">
              <span>Get Started - It's Free</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button className="px-8 py-4 border-2 border-emerald-500 text-emerald-700 rounded-xl font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-300">
            Request Demo
          </button>
        </div>
      </div>
    </section>
  );
}
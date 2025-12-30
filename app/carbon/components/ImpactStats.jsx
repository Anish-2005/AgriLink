import React from 'react';

export default function ImpactStats({ impactMetrics }) {
  return (
    <section className="py-12 bg-gradient-to-r from-emerald-600 to-teal-500 border-y-4 border-emerald-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {impactMetrics.map((metric, idx) => (
            <div key={idx} className="text-center text-white group cursor-pointer" data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold drop-shadow-lg mb-2">{metric.value}</div>
              <div className="text-sm font-bold uppercase tracking-wide opacity-90">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

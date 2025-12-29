import { Users, Globe, TrendingUp, Leaf } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { value: '10,000+', label: 'Farmers Empowered', icon: Users },
    { value: '500+', label: 'Industrial Partners', icon: Globe },
    { value: '₹25Cr+', label: 'Waste Monetized', icon: TrendingUp },
    { value: '100K+', label: 'CO₂ Tons Saved', icon: Leaf }
  ];

  return (
    <section className="py-20 bg-white border-y-4 border-emerald-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group cursor-pointer">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-emerald-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <stat.icon className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-2">{stat.value}</div>
              <div className="text-emerald-700 font-bold uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
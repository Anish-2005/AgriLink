import React from 'react';
import { BarChart3, CheckCircle, Globe } from 'lucide-react';

export default function TokenInfo() {
  const items = [
    {
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      title: 'Simple Ratio',
      desc: 'Every 1 ton (1000 kg) of CO₂ saved equals 1 Carbon Token',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: 'Verified Credits',
      desc: 'All CO₂ savings are independently verified and converted to tradeable carbon tokens',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Globe className="h-8 w-8 text-white" />,
      title: 'Real Impact',
      desc: 'Your tokens represent genuine environmental impact and sustainable farming practices',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border-2 border-emerald-500">
      <h2 className="text-3xl font-extrabold text-emerald-800 mb-8 text-center drop-shadow-lg">Carbon Token System</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div key={idx} className="text-center" data-aos="fade-up" data-aos-delay={idx * 200}>
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} mb-6`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-extrabold text-emerald-800 mb-3">{item.title}</h3>
            <p className="text-emerald-900 leading-relaxed font-semibold">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

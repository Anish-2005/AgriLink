import React from 'react';

export default function FeaturesGrid({ features }) {
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((f, i) => (
        <div key={i} className={`p-6 rounded-2xl shadow-lg bg-white border-2 ${f.color} border-transparent`}>
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-r from-emerald-500 to-lime-400 p-3 rounded-xl text-white">
              <f.icon className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-emerald-800">{f.title}</h4>
              <p className="text-emerald-700 mt-1 text-sm">{f.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

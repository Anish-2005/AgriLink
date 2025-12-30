import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ProgressSteps({ steps, step }) {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-lime-50 border-b-2 border-emerald-500">
      <div className="grid grid-cols-3 px-8 py-6">
        {steps.map((stepItem, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className={`relative h-14 w-14 rounded-full flex items-center justify-center mb-3 ${
              step > stepItem.number 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-4 border-emerald-500' 
                : step === stepItem.number 
                ? 'bg-white border-4 border-emerald-500' 
                : 'bg-gray-100 border-4 border-gray-300'
            } shadow-lg`}>
              {step > stepItem.number ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : (
                <span className={`text-xl font-extrabold ${step === stepItem.number ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {stepItem.number}
                </span>
              )}
            </div>
            <span className={`text-sm font-extrabold uppercase tracking-wide ${step >= stepItem.number ? 'text-emerald-800' : 'text-gray-400'}`}>
              {stepItem.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

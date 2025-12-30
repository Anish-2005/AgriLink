import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CompleteStep({ resetProcess }) {
  return (
    <div className="p-12 text-center">
      <h2 className="text-3xl font-extrabold text-emerald-800 mb-4">Listing Submitted</h2>
      <p className="text-emerald-700 mb-8">Your waste listing has been submitted and is now visible to buyers.</p>
      <div className="flex justify-center gap-4">
        <button onClick={resetProcess} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-extrabold">Create Another Listing</button>
        <button className="px-6 py-3 border-2 border-emerald-500 rounded-xl text-emerald-700">View Listings <ArrowRight className="inline h-4 w-4 ml-2" /></button>
      </div>
    </div>
  );
}

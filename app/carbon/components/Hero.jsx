import React from 'react';
import { Leaf } from 'lucide-react';
import { FiTarget, FiCreditCard } from 'react-icons/fi';

export default function Hero({ walletData, loading, user }) {
  return (
    <div className="space-y-8">
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-emerald-500 rounded-full shadow-md">
        <Leaf className="h-4 w-4 text-emerald-600" />
        <span className="text-base font-extrabold text-emerald-700">Carbon Credit Wallet</span>
      </div>

      <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-emerald-800 drop-shadow-xl">
        Your Sustainable
        <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
          Impact Portfolio
        </span>
      </h1>

      <p className="text-xl text-emerald-900 leading-relaxed drop-shadow-md font-semibold">
        Track and manage your verified CO₂ credits earned through sustainable farming practices.
        <span className="block mt-2 text-lg font-extrabold text-emerald-700">1 ton CO₂ saved = 1 Carbon Token</span>
      </p>

      {!loading && walletData && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-lime-400 text-white rounded-2xl p-6 shadow-lg border-2 border-emerald-600">
            <div className="flex items-center space-x-3">
              <FiTarget className="h-6 w-6" />
              <div>
                <p className="text-sm font-bold opacity-90">CO₂ Saved</p>
                <p className="text-2xl font-extrabold">{walletData.totalCO2.toLocaleString()} kg</p>
                <p className="text-xs opacity-80 mt-1">{walletData.equivalent}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-emerald-400 text-white rounded-2xl p-6 shadow-lg border-2 border-emerald-600">
            <div className="flex items-center space-x-3">
              <FiCreditCard className="h-6 w-6" />
              <div>
                <p className="text-sm font-bold opacity-90">Carbon Tokens</p>
                <p className="text-2xl font-extrabold">{walletData.totalTokens}</p>
                <p className="text-xs opacity-80 mt-1">Verified Credits</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
